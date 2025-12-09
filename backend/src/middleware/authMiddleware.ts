import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";

interface MyJwtPayload extends JwtPayload {
  id: string;
  email: string;
}


export const protect = (req: Request, res: Response, next: NextFunction) => {
  const tokenFromCookie = req.cookies?.quiz_gen_access_token;
  const token = tokenFromCookie;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as MyJwtPayload;
    (req as any).user = { id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    res.status(401).json({ error: "Token is not valid" });
  }
};
