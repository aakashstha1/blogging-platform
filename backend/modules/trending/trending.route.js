import express from "express";
import { getTrendingPosts } from "./trending.controller.js";

const router = express.Router();

// Public — trending is shown to guests too
router.get("/", getTrendingPosts);

export default router;
