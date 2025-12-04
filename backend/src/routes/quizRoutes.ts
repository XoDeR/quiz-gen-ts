import { Router } from "express";
import { protect } from "../middleware/authMiddleware";

import {
  /*
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  */
} from "../controllers/quizController";

const router = Router();

/*
router.route("/").get(protect, getPosts).post(protect, createPost);

router
  .route("/:id")
  .get(protect, getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);
*/

export default router;
