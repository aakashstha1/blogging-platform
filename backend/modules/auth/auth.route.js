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

const router = express.Router();

router.get("/me", isAuthenticated, getMe);
router.post("/register", validate(registerUserSchema), register);
router.post("/login", validate(loginUserSchema), login);
router.post("/logout", isAuthenticated, logout);
router.post("/refresh-token", refreshToken);

export default router;
