import { Router } from "express";
import { protect } from "../middleware/authMiddleware";

import {
  getQuizzes,
  getUserQuizzes,
  createQuiz,
  getQuizById,
  updateQuiz,
  deleteQuiz,
} from "../controllers/quizController";

const router = Router();

router.route("/").get(protect, getQuizzes).post(protect, createQuiz);
router.route("/me").get(protect, getUserQuizzes);

router
  .route("/:id")
  .get(protect, getQuizById)
  .put(protect, updateQuiz)
  .delete(protect, deleteQuiz);

export default router;
