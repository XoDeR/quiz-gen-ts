import { Router } from "express";
import { protect } from "../middleware/authMiddleware";

import {
  getSubmissions,
  getUserSubmissions,
  getSubmissionById,
  createSubmission,
  updateSubmission,
} from "../controllers/submissionController";

const router = Router();

router.route("/").get(protect, getSubmissions).post(protect, createSubmission);
router.route("/me").get(protect, getUserSubmissions);

router
  .route("/:id")
  .get(protect, getSubmissionById)
  .put(protect, updateSubmission)

export default router;
