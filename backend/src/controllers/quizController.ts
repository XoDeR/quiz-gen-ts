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

    res.status(200).json(quizzes);
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

    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getQuizById = async (req: Request, res: Response) => {
  
  interface DBCorrectAnswer {
    id: string;
    answerOptionId: string;
  }

  interface DBAnswerOption {
    id: string;
    text: string;
    displayOrder: number;
    questionId?: string;
  }

  interface QuestionOutput {
    id: string;
    text: string;
    type: "single" | "multiple";
    answerOptions: {
        id: string;
        text: string;
        displayOrder: number;
    }[];
    correctAnswers?: {
        id: string;
        answerOptionId: string;
    }[];
  }

  interface QuizResponseOutput {
    id: string;
    title: string;
    isPublished: boolean;
    updatedAt: Date;
    questions?: QuestionOutput[];
  }

  interface DBQuestion {
    id: string;
    text: string;
    type: 0 | 1;
    display_order: number;
  }
  
  try {
    const user = (req as any).user;

    if (!user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const id: string = req.params.id;
    const { withAnswers } = req.query;
    const showCorrectAnswers = withAnswers === "true";

    const [quiz] = await sql`
      SELECT id, title, is_published, updated_at
      FROM quizzes
      WHERE id = ${id}
      LIMIT 1;
    `;
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const quizResponse: QuizResponseOutput = {
      id: quiz.id,
      title: quiz.title,
      isPublished: quiz.is_published,
      updatedAt: quiz.updated_at,
    };

    // questions
    const questions: DBQuestion[] = await sql`
      SELECT 
        id, 
        text, 
        type,
        display_order
      FROM questions
      WHERE quiz_id = ${id}
      ORDER BY display_order;
    ` as DBQuestion[];

    if (questions.length > 0) {
      const questionIds = questions.map(q => q.id);

      const answerOptions: DBAnswerOption[] = await sql`
          SELECT 
              id, 
              question_id AS "questionId", 
              text, 
              display_order AS "displayOrder"
          FROM answer_options
          WHERE question_id = ANY(${questionIds})
          ORDER BY "displayOrder";
      ` as DBAnswerOption[];

      let correctAnswers: DBCorrectAnswer[] = [];
      if (showCorrectAnswers) {
          correctAnswers = await sql`
              SELECT 
                  id, 
                  answer_option_id AS "answerOptionId"
              FROM correct_answers
              WHERE answer_option_id IN (SELECT id FROM answer_options WHERE question_id = ANY(${questionIds}));
          ` as DBCorrectAnswer[];
      }

      const questionsWithDetails: QuestionOutput[] = questions.map(q => { 
        const options = answerOptions
            .filter(o => o.questionId === q.id)
            .map(({ questionId, ...optionRest }) => optionRest);

        const questionType = q.type === 0 ? "single" : "multiple";

        const questionObject: QuestionOutput = {
            id: q.id,
            text: q.text,
            type: questionType,
            answerOptions: options,
        };
        
        if (showCorrectAnswers) {
            const questionCorrectAnswers = correctAnswers.filter(ca => 
                options.some(opt => opt.id === ca.answerOptionId) 
            );

            if (questionCorrectAnswers.length > 0) {
                questionObject.correctAnswers = questionCorrectAnswers.map(ca => ({
                    id: ca.id,
                    answerOptionId: ca.answerOptionId
                }));
            }
        }

        return questionObject;
      });

      quizResponse.questions = questionsWithDetails;
    }
  
    res.status(200).json(quizResponse);
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

    await sql`BEGIN`;
    const [quiz] = await sql`
      INSERT INTO quizzes (id, title, is_published, user_id) 
      VALUES (${id}, ${title}, ${isPublished}, ${user.id})
      RETURNING *;
    `;

    const { questions, answerOptions, correctAnswers } = req.body;
    if (questions) {
      // if questions is present the rest should also be present
      if (!questions || !answerOptions || !correctAnswers) {
        await sql`ROLLBACK`;
        return res.status(400).json({ error: "Incorrect data in request" });
      }
      const errorMessage = await mutateQuizQuestions(questions, answerOptions, correctAnswers, quiz.id);
      if (errorMessage) {
        await sql`ROLLBACK`;
        return res.status(400).json({ error: errorMessage });
      }
    }

    await sql`COMMIT`;

    res.status(201).json(quiz);
  } catch (error: any) {
    await sql`ROLLBACK`;
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
    quizId: string): Promise<string | undefined> => {
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
  for (const {id, text, type, display_order} of questions.update) {
    await sql`
      UPDATE questions
      SET
        text = COALESCE(${text}, text),
        type = COALESCE(${type}, type),
        display_order = COALESCE(${display_order}, display_order),
      WHERE id = ${id}
    `;
  }

  for (const {id, text, display_order} of answerOptions.update) {
    await sql`
      UPDATE answer_options
      SET
        text = COALESCE(${text}, text),
        display_order = COALESCE(${display_order}, display_order),
      WHERE id = ${id}
    `;
  }
  // 3. create ops
  // tempId is uuid assigned on client
  // it should be replaced with id (uuid) assigned by backend
  const questionsTempIdToIdMap = new Map<string, string>();
  
  for (const {id: tempId, text, type: typeStr, display_order} of questions.create) {
    const id = uuidv4();
    questionsTempIdToIdMap.set(tempId, id);
    const type: number = (typeStr === "single") ? 0 : 1;
    const [question] = await sql`
      INSERT INTO questions (id, text, type, display_order, quiz_id) VALUES (${id}, ${text}, ${type}, ${display_order}, ${quizId})
    `;
  }

  const answerOptionsTempIdToIdMap = new Map<string, string>();
  for (const {id: tempId, question_id: tempQuestionId, text, display_order} of answerOptions.create) {
    const id = uuidv4();
    answerOptionsTempIdToIdMap.set(tempId, id);
    // answerOption could be created on
    // - already existing question
    // - new question just created, then it uses tempId that's looked up from the map
    let questionId: string | undefined = undefined;
    const [questionExists] = await sql`
      SELECT EXISTS(
        SELECT 1 FROM questions WHERE id = ${tempQuestionId}
      ) AS found;
    `;

    if (questionExists.found) {
      // question exists
      questionId = tempQuestionId;
    } else {
      // try to find real question_id from the map
      questionId = questionsTempIdToIdMap.get(tempQuestionId);
    }
    
    if (!questionId) {
      // return error, don't process further
      return "Incorrect answerOption data";
    }

    const [answerOption] = await sql`
      INSERT INTO answer_options (id, text, display_order, question_id) VALUES (${id}, ${text}, ${display_order}, ${questionId})
    `;
  }

  for (const {question_id: tempQuestionId, answer_option_id: tempAnswerOptionId} of correctAnswers.create) {
    const id = uuidv4();
    let questionId: string | undefined = undefined;
    const [questionExists] = await sql`
      SELECT EXISTS(
        SELECT 1 FROM questions WHERE id = ${tempQuestionId}
      ) AS found;
    `;

    if (questionExists.found) {
      // question exists
      questionId = tempQuestionId;
    } else {
      // try to find real question_id from the map
      questionId = questionsTempIdToIdMap.get(tempQuestionId);
    }
    
    if (!questionId) {
      // return error, don't process further
      return "Incorrect correctAnswer data";
    }
    let answerOptionId: string | undefined = undefined;
    const [answerOptionExists] = await sql`
      SELECT EXISTS(
        SELECT 1 FROM answer_options WHERE id = ${tempAnswerOptionId}
      ) AS found;
    `;

    if (answerOptionExists.found) {
      // answerOption exists
      answerOptionId = tempAnswerOptionId;
    } else {
      // try to find real answer_option_id from the map
      answerOptionId = answerOptionsTempIdToIdMap.get(tempAnswerOptionId);
    }
    
    if (!answerOptionId) {
      // return error, don't process further
      return "Incorrect correctAnswer data";
    }

    const [correctAnswer] = await sql`
      INSERT INTO correct_answers (id, question_id, answer_option_id) VALUES (${id}, ${questionId}, ${answerOptionId})
    `;
  }

  // no errors
  return undefined;
};

export const updateQuiz = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const id: string = req.params.id;

    const { title, isPublished } = req.body;

    await sql`BEGIN`;
    const [quiz] = await sql`
      UPDATE quizzes
      SET
        title = COALESCE(${title}, title),
        is_published = COALESCE(${isPublished}, is_published),
        updated_at = now()
      WHERE id = ${id}
      RETURNING *;
    `;

    const { questions, answerOptions, correctAnswers } = req.body;
    if (questions) {
      // if questions is present the rest should also be present
      if (!questions || !answerOptions || !correctAnswers) {
        await sql`ROLLBACK`;
        return res.status(400).json({ error: "Incorrect data in request" });
      }
      const errorMessage = await mutateQuizQuestions(questions, answerOptions, correctAnswers, quiz.id);
      if (errorMessage) {
        await sql`ROLLBACK`;
        return res.status(400).json({ error: errorMessage });
      }
    }
    
    await sql`COMMIT`;
    res.json(quiz);
  } catch (error) {
    await sql`ROLLBACK`;
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
