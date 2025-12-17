import { Request, Response } from "express";
import { sql } from "../services/db";
import { v4 as uuidv4 } from "uuid";

// get all submissions
export const getSubmissions = async (req: Request, res: Response) => {
  try {
    const submissions = {};
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// get all submissions by current user
export const getUserSubmissions = async (req: Request, res: Response) => {
}

export const getSubmissionById = async (req: Request, res: Response) => {
}

export const createSubmission = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = user.id;

    const { quizId, completed, attemptedAnswersData } = req.body;

    console.log("quizId: ", quizId);
    console.log("completed: ", completed);
    console.log("attemptedAnswersData: ", attemptedAnswersData);

    if (!quizId || completed === undefined || !attemptedAnswersData) {
      return res.status(400).json({ error: "Incorrect data in request" });
    }

    await sql`BEGIN`;
    // user can have many submissions
    // but only one submission per quiz
    // to ensure this all previous submissions per user per quiz are deleted
    await sql`
      DELETE FROM submissions
      WHERE user_id = ${user.id} AND quiz_id = ${quizId};
    `;

    const id = uuidv4();

    const [submission] = await sql`
      INSERT INTO submissions (id, completed, user_id, quiz_id) 
      VALUES (${id}, ${completed}, ${user.id}, ${quizId})
      RETURNING *;
    `;

    const submissionId = submission.id;

    // parse attemptedAnswersData
    const usedQuestionIdList: string[] = [];
    const usedAnswerOptionIdList: string[] = [];

    interface QuestionWithAnswerOptions {
      questionId: string;
      answerOptionIdList: string[];
    };

    const questionWithAnswerOptionsList: QuestionWithAnswerOptions[] = [];
    for (const [questionId, answer] of Object.entries(attemptedAnswersData)) {
      usedQuestionIdList.push(questionId);
      const answerOptionIdList: string[] = [];
      if (Array.isArray(answer)) {
        for (const answerOptionId of answer) {
          usedAnswerOptionIdList.push(answerOptionId);
          answerOptionIdList.push(answerOptionId);
        }
      } else {
        const answerOptionId = answer as string;
        usedAnswerOptionIdList.push(answerOptionId);
        answerOptionIdList.push(answerOptionId);
      }
      questionWithAnswerOptionsList.push({questionId, answerOptionIdList });
    }

    // validate if questions and answerOptions exist
    let requestDataValid = true;
    const uniqueUsedQuestionIdList = [...new Set(usedQuestionIdList)];
    if (uniqueUsedQuestionIdList.length !== usedQuestionIdList.length) {
      requestDataValid = false;
    }
    if (uniqueUsedQuestionIdList.length === 0) {
      // no questions answered
      requestDataValid = false;
    }
    {
      const [result] = await sql`
        SELECT COUNT(id)::int AS found_count
        FROM answer_options
        WHERE id IN ANY(${uniqueUsedQuestionIdList})};
      `;
      const allExist = result.found_count === uniqueUsedQuestionIdList.length;
      if (!allExist) {
        // some used ids don't exist in db
        requestDataValid = false;
      }
    }

    const uniqueUsedAnswerOptionIdList = [...new Set(usedAnswerOptionIdList)]; 
    if (uniqueUsedAnswerOptionIdList !== usedAnswerOptionIdList) {
      requestDataValid = false;
    }
    if (uniqueUsedAnswerOptionIdList.length === 0) {
      // no answer options given
      requestDataValid = false;
    }
    {
      const [result] = await sql`
        SELECT COUNT(id)::int AS found_count
        FROM answer_options
        WHERE id IN ANY(${uniqueUsedAnswerOptionIdList})};
      `;
      const allExist = result.found_count === uniqueUsedAnswerOptionIdList.length;
      if (!allExist) {
        // some used ids don't exist in db
        requestDataValid = false;
      }
    }
    if (!requestDataValid) {
      await sql`ROLLBACK`;
      return res.status(400).json({ error: "Incorrect data in request" });
    }

    // all used ids are validated
    for (const questionWithAnswerOptions of questionWithAnswerOptionsList) {
      const questionId = questionWithAnswerOptions.questionId;
      for (const answerOptionId of questionWithAnswerOptions.answerOptionIdList) {
        const id = uuidv4();
        const [attemptedAnswer] = await sql`
          INSERT INTO attempted_answers (id, user_id, quiz_id, submission_id, question_id, answer_option_id) 
          VALUES (${id}, ${userId}, ${quizId}, ${submissionId}, ${questionId}, ${answerOptionId})
          RETURNING *;
        `;
      }
    }

    if (completed) {
      // completed submission should also calculate result
      // TODO calc result for submission

      // for multiple choice algo is "partial credit"
      // w -- weight of a question
      // n -- number of correct choices
      // each correct answer adds w * 1/n points to a question
      // each incorrect answer is worth a penalty -w * 1/n points
      
      for (const questionWithAnswerOptions of questionWithAnswerOptionsList) {
        const questionId = questionWithAnswerOptions.questionId;
        
        // get total number of answers
        
        const correctAnswerOptions = await sql`
          SELECT answer_option_id
          FROM correct_answers
          WHERE question_id = ${questionId};
        `;

      }
    }

    await sql`COMMIT`;

    res.status(201).json(submission);
  } catch (error) {
    
  }
}

export const updateSubmission = async (req: Request, res: Response) => {
}

