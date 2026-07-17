import express from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import {
  createLike,
  getMyLikedPosts,
  unlikePost,
  getPostLikeCount,
  createCommentLike,
  getMyLikedComments,
  unlikeComment,
  getCommentLikeCount,
} from "./like.controller.js";

const router = express.Router();

// ---------------------------------------------- Post likes ----------------------------------------------
router.get("/posts", isAuthenticated, getMyLikedPosts);
router.post("/posts/:postId", isAuthenticated, createLike);
router.delete("/posts/:postId", isAuthenticated, unlikePost);
router.get("/posts/:postId/count", getPostLikeCount);

// ---------------------------------------------- Comment likes ----------------------------------------------
router.get("/comments", isAuthenticated, getMyLikedComments);
router.post("/comments/:commentId", isAuthenticated, createCommentLike);
router.delete("/comments/:commentId", isAuthenticated, unlikeComment);
router.get("/comments/:commentId/count", getCommentLikeCount);

export default router;
