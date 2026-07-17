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

const router = express.Router();

// Reads are public — comments on a published post should be guest-visible
router.get("/post/:postId/count", getCommentCountForPost);
router.get("/comment/:commentId/count", getCommentCountForParentComment);
router.get("/posts/:postId/comments", getCommentsByPostId);
router.get("/user/comments", isAuthenticated, getCommentsByUserId);
router.get("/:commentId", getCommentById);

router.post(
  "/posts/:postId/comments",
  isAuthenticated,
  authorizeRoles("user", "admin"),
  validate(createCommentSchema),
  createComment,
);

router.patch(
  "/:commentId",
  isAuthenticated,
  validate(updateCommentSchema),
  updateComment,
);

router.delete("/:commentId", isAuthenticated, deleteComment);

export default router;
