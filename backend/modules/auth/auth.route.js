import express from "express";
import { register } from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { registerUserSchema } from "../users/user.validation.js";

const router = express.Router();

router.post("/register", validate(registerUserSchema), register);

export default router;
