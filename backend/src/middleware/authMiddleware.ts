import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const secret = "MY_SUPER_JWT_SECRET_MNBVCXZ";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "not authorized" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token is not valid" });
  }
};
