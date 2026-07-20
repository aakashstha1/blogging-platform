import express from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { getRecommendedPosts } from "./recommendation.controller.js";

const router = express.Router();

// Requires login — recommendations are based on the user's own view history.
// Guests have nothing to recommend against (see trending for a guest-facing
// equivalent).
router.get("/me", isAuthenticated, getRecommendedPosts);

export default router;
