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
      return res.status(400).json({ error: "Incorrect data in request. no quizId|completed|data" });
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

    interface DBSubmission {
      id: string;
      completed: boolean;
      rating?: string;
      user_id: string;
      quiz_id: string;
    }

    let submission: DBSubmission | undefined = undefined;
    const [newSubmission] = await sql`
      INSERT INTO submissions (id, completed, user_id, quiz_id) 
      VALUES (${id}, ${completed}, ${user.id}, ${quizId})
      RETURNING *;
    `;
    submission = {id: newSubmission.id, 
      completed: newSubmission.completed,
      user_id: newSubmission.user_id,
      quiz_id: newSubmission.quiz_id,
    };

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

    console.log("usedAnswerOptionIdList: ", usedAnswerOptionIdList);

    // validate if questions and answerOptions exist
    let requestDataValid = true;
    const uniqueUsedQuestionIdList = [...new Set(usedQuestionIdList)];
    if (uniqueUsedQuestionIdList.length !== usedQuestionIdList.length) {
      console.log("questions not unique");
      requestDataValid = false;
    }
    if (uniqueUsedQuestionIdList.length === 0) {
      // no questions answered
      console.log("no questions answered");
      requestDataValid = false;
    }
    {
      const [result] = await sql`
        SELECT COUNT(id)::int AS found_count
        FROM questions
        WHERE id = ANY(${uniqueUsedQuestionIdList});
      `;
      const allExist = result.found_count === uniqueUsedQuestionIdList.length;
      if (!allExist) {
        // some used ids don't exist in db
        console.log("some used ids don't exist in db: questions");
        requestDataValid = false;
      }
    }

    const uniqueUsedAnswerOptionIdList = [...new Set(usedAnswerOptionIdList)]; 
    if (uniqueUsedAnswerOptionIdList.length !== usedAnswerOptionIdList.length) {
      console.log("answer options not unique");
      requestDataValid = false;
    }
    if (uniqueUsedAnswerOptionIdList.length === 0) {
      // no answer options given
      console.log("no answer options given");
      requestDataValid = false;
    }
    {
      const [result] = await sql`
        SELECT COUNT(id)::int AS found_count
        FROM answer_options
        WHERE id = ANY(${uniqueUsedAnswerOptionIdList});
      `;
      const allExist = result.found_count === uniqueUsedAnswerOptionIdList.length;
      if (!allExist) {
        // some used ids don't exist in db
        console.log("some used ids don't exist in db: answer options");
        requestDataValid = false;
      }
    }
    if (!requestDataValid) {
      await sql`ROLLBACK`;
      return res.status(400).json({ error: "Incorrect data in request: questions, answerOptions" });
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
      
      // get all questions of the quiz
      const quizQuestionList = await sql `
        SELECT id
        FROM questions
        WHERE quiz_id = ${quizId}
      `;

      const totalQuestions = quizQuestionList.length;
      let points: number = 0.0;
      for (const quizQuestion of quizQuestionList) {
        const quizQuestionId = quizQuestion.id;
        const foundQuestionWithAnswerOptions = questionWithAnswerOptionsList.find(
          (questionWithAnswerOptions) => questionWithAnswerOptions.questionId === quizQuestionId
        );
        if (foundQuestionWithAnswerOptions) {
          // calc question points
          // using Pro­por­tion­al Scor­ing
          // Pro­por­tion­al scor­ing bal­ances the per­cent­age of cor­rect answers select­ed 
          // with a penal­ty based on incor­rect selec­tions, pre­vent­ing ​"select all" 
          // strate­gies while fair­ly reward­ing par­tial knowledge.
          // For­mu­la: Score = (Correct Selections / Total Correct) × (1 - Incorrect Selections / Total Incorrect)

          const questionId = foundQuestionWithAnswerOptions.questionId;

          const allAnswerOptions = await sql`
            SELECT id
            FROM answer_options
            WHERE question_id = ${questionId}
          `;

          const correctAnswerOptions = await sql`
            SELECT answer_option_id AS id
            FROM correct_answers
            WHERE question_id = ${questionId};
          `;

          const totalCorrect = correctAnswerOptions.length;
          const totalIncorrect = allAnswerOptions.length - totalCorrect;

          if (totalCorrect === 0 || totalIncorrect === 0) {
            console.error("Question score can't be calculated");
            break;
          }

          let correctSelections = 0;
          let incorrectSelections = 0;

          for (const answerOption of allAnswerOptions) {
            const answerOptionId = answerOption.id;
            const foundInCorrect = correctAnswerOptions.find((cao) => cao.id === answerOptionId);
            const shouldBeChecked: boolean = !!foundInCorrect;
            const foundInGiven = foundQuestionWithAnswerOptions.answerOptionIdList.find((aoi) => aoi === answerOptionId);
            const checkedInGiven: boolean = !!foundInGiven;
            if (shouldBeChecked === true) {
              if (checkedInGiven === true) {
                correctSelections++; 
              } else { 
                incorrectSelections++;
              }
            } else {
              if (checkedInGiven === true) {
                incorrectSelections++; 
              } else { 
                correctSelections++;
              }
            }
          }

          const questionScore = (correctSelections / totalCorrect) * (1 - (incorrectSelections / totalIncorrect));
          console.log("correctSelections:", correctSelections);
          console.log("totalCorrect:", totalCorrect);
          console.log("incorrectSelections:", incorrectSelections);
          console.log("totalIncorrect:", totalIncorrect);
          console.log("questionScore:", questionScore);
          // add question points
          const questionWeight = 1 / totalQuestions;
          points += questionWeight * questionScore;
        } else {
          // no points added for this question
        }
      }
      // save calculated points as xx/yy where xx correctly (partially correctly) answered, yy -- number of questions
      const result: string = (points * totalQuestions).toFixed(2) + "/" + totalQuestions.toFixed();
      const [updatedSubmission] = await sql `
        UPDATE submissions
        SET
          result = ${result},
          updated_at = now()
        WHERE id = ${submissionId}
        RETURNING *;
      `;

      submission = {id: updatedSubmission.id, 
        completed: updatedSubmission.completed,
        user_id: updatedSubmission.user_id,
        quiz_id: updatedSubmission.quiz_id,
      };
    }

    await sql`COMMIT`;

    res.status(201).json(submission);
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
}

export const updateSubmission = async (req: Request, res: Response) => {
}

