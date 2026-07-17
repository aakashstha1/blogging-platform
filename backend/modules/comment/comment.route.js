import express from "express";

import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createComment,
  deleteComment,
  getCommentById,
  getCommentCountForParentComment,
  getCommentCountForPost,
  getCommentsByPostId,
  getCommentsByUserId,
  updateComment,
} from "./comment.controller.js";
import {
  createCommentSchema,
  updateCommentSchema,
} from "./comment.validation.js";
import { commentRateLimiter } from "../../middlewares/rateLimiter.middleware.js";

const router = express.Router();

// Reads are public — comments on a published post should be guest-visible
router.get("/posts/:postId/count", getCommentCountForPost);
router.get("/posts/:postId", getCommentsByPostId);
router.get("/:commentId/replies/count", getCommentCountForParentComment);

// "My own comments" — self-scoped, requires login
router.get("/me", isAuthenticated, getCommentsByUserId);

router.post(
  "/posts/:postId",
  isAuthenticated,
  authorizeRoles("user", "admin"),
  commentRateLimiter,
  validate(createCommentSchema),
  createComment,
);

router.get("/:commentId", getCommentById);

router.patch(
  "/:commentId",
  isAuthenticated,
  validate(updateCommentSchema),
  updateComment,
);

router.delete("/:commentId", isAuthenticated, deleteComment);

export default router;
