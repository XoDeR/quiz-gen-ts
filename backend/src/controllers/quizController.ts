import { Request, Response } from "express";
import { sql } from "../services/db";
import { v4 as uuidv4 } from "uuid";

export const getQuizzes = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const quizzes = await sql`
      SELECT id, title, is_published
      FROM quizzes
      WHERE user_id = ${user.id};
    `;

    res.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/*

export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(req.params.id) },
      include: { authors: true },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
*/

export const createQuiz = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { title, isPublished } = req.body;
    const id = uuidv4();
    const quiz = await sql`
      INSERT INTO quizzes (id, title, is_published, user_id) VALUES (${id}, ${title}, ${isPublished}, ${user.id})
    `;
    res.status(201).json(quiz);
  } catch (error: any) {
    console.error("Error fetching quizzes:");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);

    if (error.code) {
      console.error("Postgres error code:", error.code);
    }
    if (error.detail) {
      console.error("Detail:", error.detail);
    }
    if (error.hint) {
      console.error("Hint:", error.hint);
    }
    res.status(500).json({ error: "Server error" });
  }
};

/*
export const createPost = async (req: Request, res: Response) => {
  try {
    const { name, content } = req.body;

    const id = uuidv4();
    await sql`
      INSERT INTO quizzes (id, name) VALUES (${id}, ${name})
    `;


    const post = await prisma.post.create({
      data: {
        title,
        content,
        authors: {
          connect: {
            id: (req as any).user.id,
          },
        },
      },
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    UPDATE quizzes
SET title = 'New Title',
      updated_at = now()
WHERE id = '...';


    const post = await prisma.post.update({
      where: {
        id: Number(req.params.id),
      },
      data: { title, content },
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    await prisma.post.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
*/
