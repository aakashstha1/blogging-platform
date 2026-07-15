import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "./post.controller.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", isAuthenticated, authorizeRoles("user"), createPost);

router.get("/", getAllPosts);

router.get("/:id", getPostById);

router.patch("/:id", updatePost);

router.delete("/:id", deletePost);

export default router;
