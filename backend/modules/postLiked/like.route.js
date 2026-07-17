import express from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { createLike, getMyLikedPost, unlikePost } from "./like.controller.js";

const router = express.Router();

router.post("/:postId", isAuthenticated, createLike);

router.get("/", isAuthenticated, getMyLikedPost);

router.delete("/:postId", isAuthenticated, unlikePost);

export default router;
