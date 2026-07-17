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
import { upload } from "../../middlewares/upload.middleware.js";
import { uploadRateLimiter } from "../../middlewares/rateLimiter.middleware.js";

const router = express.Router();

router.get("/", isAuthenticated, authorizeRoles("admin"), getUsers);
router.get("/:id", isAuthenticated, getUserById);
router.patch(
  "/profile",
  isAuthenticated,
  uploadRateLimiter,
  upload.single("avatar"),
  validate(updateUserSchema),
  updateUser,
);
router.delete("/:id", isAuthenticated, authorizeRoles("admin"), deleteUser);

export default router;
