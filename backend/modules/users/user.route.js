import express from "express";
import {
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "./user.controller.js";
import { authorizeRoles } from "../../middlewares/role.middleware.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { updateUserSchema } from "./user.validation.js";

const router = express.Router();

router.get("/", isAuthenticated, authorizeRoles("admin"), getUsers);
router.get("/:id", getUserById);
router.patch(
  "/profile",
  validate(updateUserSchema),
  isAuthenticated,
  authorizeRoles("user"),
  updateUser,
);
router.delete("/:id", isAuthenticated, authorizeRoles("user"), deleteUser);

export default router;
