import express from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "./user.controller.js";
import { registerUserSchema } from "./user.validation.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", validate(registerUserSchema), createUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
