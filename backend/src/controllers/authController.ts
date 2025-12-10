import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { sql } from "../services/db";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

// Routes:
// /register
// /login

// register
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const [existingUser] = await sql`
      SELECT id, username, email
      FROM users
      WHERE email = ${email}
      LIMIT 1;
    `;
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

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

    const payload = { id: user.id, email: user.email };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '15m' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}