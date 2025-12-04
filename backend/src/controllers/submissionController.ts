import { Request, Response } from "express";
import { sql } from "../services/db";
import { v4 as uuidv4 } from "uuid";

// getSubmissionsWithQuizzesByUserId
export const getSubmissions = async (req: Request, res: Response) => {
  try {
    const submissions = {};
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

