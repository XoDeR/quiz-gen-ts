import { Router } from "express";
import { protect } from "../middleware/authMiddleware";

import {
  getQuizzes,
  getUserQuizzes,
  createQuiz,
  /*
  getPostById,
  
  updatePost,
  deletePost,
  */
} from "../controllers/quizController";

const router = Router();

router.route("/").get(protect, getQuizzes).post(protect, createQuiz);
router.route("/me").get(protect, getUserQuizzes);

/*
router
  .route("/:id")
  .get(protect, getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);
*/

export default router;
