import express from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { getMyRecentlyViewed } from "./view.controller.js";

const router = express.Router();

// Requires login — guests have no view history to look up
router.get("/me", isAuthenticated, getMyRecentlyViewed);

export default router;
