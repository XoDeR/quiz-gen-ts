import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { sql } from "../services/db";
import { v4 as uuidv4 } from "uuid";
import {
  createJti,
  signAccessToken,
  signRefreshToken,
  persistRefreshToken,
  setRefreshCookie,
  hashToken,
  rotateRefreshToken,
  setAccessCookie
} from "../utils/tokens";
import jwt, { JwtPayload } from "jsonwebtoken";

interface RefreshJwtPayload extends JwtPayload {
  id: string;
  jti: string;
}

// Routes:
// /register
// /login
// /logout
// /refresh
// /me

// register
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const [existingUserByEmail] = await sql`
      SELECT id, username, email
      FROM users
      WHERE email = ${email}
      LIMIT 1;
    `;
    if (existingUserByEmail) return res.status(400).json({ message: 'User with this email already exists' });

    const [existingUserByUsername] = await sql`
      SELECT id, username, email
      FROM users
      WHERE username = ${username}
      LIMIT 1;
    `;
    if (existingUserByUsername) return res.status(400).json({ message: 'User with this username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    // neon returns array of rows, we need first row like user = result[0], so we destructure user here
    const [newUser] = await sql`
      INSERT INTO users (id, username, email, password)
      VALUES (${id}, ${username}, ${email}, ${hashedPassword})
      RETURNING id, username, email;
    `;
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const [user] = await sql`
      SELECT id, username, email, password
      FROM users
      WHERE email = ${email}
      LIMIT 1;
    `;

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const accessToken = signAccessToken({ id: user.id, email: user.email });

    const jti = createJti();
    const refreshToken = signRefreshToken({ id: user.id }, jti);

    await persistRefreshToken({
      user: { id: user.id },
      refreshToken,
      jti,
      ip: req.ip,
      userAgent: req.headers['user-agent'] || ''
    });

    setRefreshCookie(res, refreshToken);
    setAccessCookie(res, accessToken);

    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

export const me = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "No user attached to request" });
    }
    const [user] = await sql`
      SELECT id, username, email
      FROM users
      WHERE id = ${userId}
      LIMIT 1;
    `;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ id: user.id, username: user.username, email: user.email });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

export const refresh = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.quiz_gen_refresh_token;
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    let decoded: RefreshJwtPayload;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as RefreshJwtPayload;
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
    const tokenHash = hashToken(token);
    const [refreshToken] = await sql`
      SELECT rt.id,
            rt.user_id,
            rt.token_hash,
            rt.jti,
            rt.expires_at,
            rt.revoked_at,
            rt.replaced_by,
            u.id AS user_id,
            u.username,
            u.email
      FROM refresh_tokens rt
      JOIN users u ON rt.user_id = u.id
      WHERE rt.token_hash = ${tokenHash}
        AND rt.jti = ${decoded.jti}
      LIMIT 1;
    `;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not recognized' });
    }
    if (refreshToken.revoked_at) {
      return res.status(401).json({ message: 'Refresh token revoked' });
    }
    if (refreshToken.expires_at < new Date()) {
      return res.status(401).json({ message: 'Refresh token expired' });
    }

    const user = {
      id: refreshToken.user_id,
      username: refreshToken.username,
      email: refreshToken.email,
    };

    const result = await rotateRefreshToken(refreshToken.id, user, req, res);
    setAccessCookie(res, result.accessToken);
    res.json({ message: "Refresh successful" });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.quiz_gen_refresh_token;
    if (token) {
      const tokenHash = hashToken(token);
      const [refreshToken] = await sql`
        SELECT id, revoked_at
        FROM refresh_tokens
        WHERE token_hash = ${tokenHash}
        LIMIT 1;
      `;
      if (refreshToken && !refreshToken.revoked_at) {
        await sql`
          UPDATE refresh_tokens
          SET revoked_at = ${new Date()}
          WHERE id = ${refreshToken.id};
        `;
      }
    }
    res.clearCookie('quiz_gen_refresh_token', { path: '/api/auth/refresh' });
    res.clearCookie('quiz_gen_access_token', { path: '/api' });
    res.json({ message: 'Logged out' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}