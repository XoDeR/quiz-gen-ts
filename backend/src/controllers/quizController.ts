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

export const getQuizById = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const id: string = req.params.id;

    const [quiz] = await sql`
      SELECT id, title, is_published, updated_at
      FROM quizzes
      WHERE id = ${id}
      LIMIT 1;
    `;
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // TODO: attach related questions, answerOptions, correct answers
  
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

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
    if (!questions || !answerOptions || !correctAnswers) {
      return res.status(400).json({ error: "Incorrect data in request" });
    }
    await mutateQuizQuestions(questions, answerOptions, correctAnswers, quiz.id);

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

const mutateQuizQuestions = async (questions: QuizMutateQuestions, 
    answerOptions: QuizMutateAnswerOptions, 
    correctAnswers: QuizMutateCorrectAnswers, 
    quizId: string) => {
  // 1. delete ops
  for (const id of correctAnswers.delete) {
    await sql`
      DELETE FROM correct_answers
      WHERE id = ${id};
    `;
  }
  for (const id of answerOptions.delete) {
    await sql`
      DELETE FROM answer_options
      WHERE id = ${id};
    `;
  }
  for (const id of questions.delete) {
    await sql`
      DELETE FROM questions
      WHERE id = ${id};
    `;
  }
  // 2. update ops

  // 3. create ops
  
  
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

export const updateQuiz = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const id: string = req.params.id;

    const { title, is_published } = req.body;

    const [quiz] = await sql`
      UPDATE quizzes
      SET
        title = COALESCE(${title}, title),
        is_published = COALESCE(${is_published}, is_published),
        updated_at = now()
      WHERE id = ${id}
      RETURNING *;
    `;

    
    
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    await sql`
      DELETE FROM quizzes
      WHERE id = ${id};
    `;
    res.json({ message: "Quiz deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
