import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  publishPost,
  searchPosts,
} from "./post.controller.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/role.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createPostSchema, updatePostSchema } from "./post.validation.js";
import {
  createPostRateLimiter,
  deletePostRateLimiter,
  updatePostRateLimiter,
  uploadRateLimiter,
} from "../../middlewares/rateLimiter.middleware.js";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/:id", isAuthenticated, getPostById);

router.post(
  "/",
  isAuthenticated,
  authorizeRoles("user"),
  createPostRateLimiter,
  uploadRateLimiter,
  upload.single("coverImage"),
  validate(createPostSchema),
  createPost,
);

router.patch(
  "/:id",
  isAuthenticated,
  updatePostRateLimiter,
  upload.single("coverImage"),
  validate(updatePostSchema),
  updatePost,
);

router.patch("/:id/publish", isAuthenticated, publishPost);
// router.patch("/:id/unpublish", isAuthenticated, unpublishPost);

router.delete("/:id", isAuthenticated, deletePostRateLimiter, deletePost);
router.get("/search", searchPosts);

export default router;
