import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { sql } from "../services/db";
import jwt from "jsonwebtoken";

const secret = "MY_SUPER_JWT_SECRET_MNBVCXZ";

/*
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ id: user.id }, secret, { expiresIn: "3h" });
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: "Username already exists or unknown error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, secret, { expiresIn: "3h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
*/
