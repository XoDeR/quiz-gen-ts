import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sql } from "../services/db";

const ACCESS_TTL = "15m";
const REFRESH_TTL_SEC = 60 * 60 * 24 * 7; // 7 days

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function createJti(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function signAccessToken(user: { id: string; email: string }): string {
  const payload = { id: user.id, email: user.email };
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: ACCESS_TTL });
}

export function signRefreshToken(user: { id: string }, jti: string): string {
  const payload = { id: user.id, jti };
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: REFRESH_TTL_SEC,
  });
}

export async function persistRefreshToken({
  user,
  refreshToken,
  jti,
  ip,
  userAgent,
}: {
  user: { id: string };
  refreshToken: string;
  jti: string;
  ip?: string;
  userAgent?: string;
}): Promise<void> {
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + REFRESH_TTL_SEC * 1000);

  await sql`
    INSERT INTO refresh_tokens (user_id, token_hash, jti, expires_at, ip, user_agent)
    VALUES (${user.id}, ${tokenHash}, ${jti}, ${expiresAt}, ${ip}, ${userAgent});
  `;
}

export function setAccessCookie(res: any, accessToken: string): void {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("quiz_gen_access_token", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/api",
    maxAge: 15 * 60 * 1000 // 15 minutes in ms,
  });
}

export function setRefreshCookie(res: any, refreshToken: string): void {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("quiz_gen_refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/api/auth/refresh",
    maxAge: REFRESH_TTL_SEC * 1000,
  });
}

export async function rotateRefreshToken(
  oldTokenId: string,
  user: { id: string; email: string },
  req: any,
  res: any
): Promise<{ accessToken: string }> {
  // revoke old
  const newJti = createJti();
  await sql`
    UPDATE refresh_tokens
    SET revoked_at = ${new Date()}, replaced_by = ${newJti}
    WHERE id = ${oldTokenId};
  `;

  // issue new
  const newAccess = signAccessToken(user);
  const newRefresh = signRefreshToken(user, newJti);

  await persistRefreshToken({
    user,
    refreshToken: newRefresh,
    jti: newJti,
    ip: req.ip,
    userAgent: req.headers["user-agent"] || "",
  });

  setRefreshCookie(res, newRefresh);
  return { accessToken: newAccess };
}
