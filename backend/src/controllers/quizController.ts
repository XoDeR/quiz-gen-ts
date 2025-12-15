import { Request, Response } from "express";
import { sql } from "../services/db";
import { v4 as uuidv4 } from "uuid";
import { QuizMutateAnswerOptions, QuizMutateCorrectAnswers, QuizMutateQuestions } from "../interfaces";

export const getQuizzes = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { published, byOthers } = req.query;

    const publishedFilter =
      published !== undefined ? sql`is_published = ${published === "true"}` : null;

    const byOthersFilter =
      byOthers === "true" ? sql`user_id != ${user.id}` : null;

    const filters = [publishedFilter, byOthersFilter].filter(Boolean);

    let quizzes;
    if (filters.length > 0) {
      quizzes = await sql`
        SELECT id, title, is_published, updated_at
        FROM quizzes
        WHERE ${sql`${filters[0]}${filters[1] ? sql` AND ${filters[1]}` : sql``}`}
      `;
    } else {
      quizzes = await sql`
        SELECT id, title, is_published, updated_at
        FROM quizzes
      `;
    }

    res.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getUserQuizzes = async (req: Request, res: Response) => {
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
    const [quiz] = await sql`
      INSERT INTO quizzes (id, title, is_published, user_id) VALUES (${id}, ${title}, ${isPublished}, ${user.id})
    `;

    const { questions, answerOptions, correctAnswers } = req.body;
    if (questions) {
      await mutateQuizQuestions(questions, quiz.id);
    }
    if (answerOptions) {
      await mutateQuizAnswerOptions(answerOptions, quiz.id);
    }
    if (correctAnswers) {
      await mutateQuizCorrectAnswers(correctAnswers, quiz.id);
    }

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

const mutateQuizQuestions = async (questions: QuizMutateQuestions, quizId: string) => {
  for (const {text, type: typeStr, display_order} of questions.create) {
    const id = uuidv4();
    const type: number = (typeStr === "single") ? 0 : 1;
    const [question] = await sql`
      INSERT INTO questions (id, text, type, display_order, user_id) VALUES (${id}, ${title}, ${isPublished}, ${user.id})
    `;
  }
    
};

const mutateQuizAnswerOptions = async (answerOptions: QuizMutateAnswerOptions, quizId: string) => {

}

const mutateQuizCorrectAnswers = async (correctAnswers: QuizMutateCorrectAnswers, quizId: string) => {

}

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
