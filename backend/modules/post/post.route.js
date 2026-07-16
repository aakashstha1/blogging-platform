import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  publishPost,
} from "./post.controller.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/role.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createPostSchema, updatePostSchema } from "./post.validation.js";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/:id", isAuthenticated, getPostById);

router.post(
  "/",
  isAuthenticated,
  authorizeRoles("user"),
  upload.single("coverImage"),
  validate(createPostSchema),
  createPost,
);

router.patch(
  "/:id",
  isAuthenticated,
  upload.single("coverImage"),
  validate(updatePostSchema),
  updatePost,
);

router.patch("/:id/publish", isAuthenticated, publishPost);
// router.patch("/:id/unpublish", isAuthenticated, unpublishPost);

router.delete("/:id", isAuthenticated, deletePost);

export default router;
