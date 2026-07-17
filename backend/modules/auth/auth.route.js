import express from "express";
import {
  getMe,
  login,
  logout,
  refreshToken,
  register,
} from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { loginUserSchema, registerUserSchema } from "./auth.validation.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import {
  loginRateLimiter,
  refreshTokenRateLimiter,
  registerRateLimiter,
} from "../../middlewares/rateLimiter.middleware.js";

const router = express.Router();

router.get("/me", isAuthenticated, getMe);
router.post(
  "/register",
  registerRateLimiter,
  validate(registerUserSchema),
  register,
);
router.post("/login", loginRateLimiter, validate(loginUserSchema), login);
router.post("/logout", isAuthenticated, logout);
router.post("/refresh-token", refreshTokenRateLimiter, refreshToken);

export default router;
