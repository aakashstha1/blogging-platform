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
  getComments,
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
router.get("/", getComments);
router.get("/:id", getCommentById);
router.get("/post/:id", isAuthenticated, getCommentsByPostId);
router.get("/user/:id", isAuthenticated, getCommentsByUserId);
router.get("/post/:id/count", getCommentCountForPost);
router.get("/post/comment/:id/count", getCommentCountForParentComment);

router.post(
  "/",
  isAuthenticated,
  authorizeRoles("user", "admin"),
  validate(createCommentSchema),
  createComment,
);

router.patch(
  "/:id",
  isAuthenticated,
  validate(updateCommentSchema),
  updateComment,
);

router.delete("/:id", isAuthenticated, deleteComment);

export default router;
