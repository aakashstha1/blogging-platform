import express from "express";

import { validate } from "../../middlewares/validate.middleware.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "./category.controller.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.validation.js";
import { authorizeRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", isAuthenticated, getCategories);
router.post(
  "/",
  isAuthenticated,
  authorizeRoles("admin"),
  validate(createCategorySchema),
  createCategory,
);

router.get("/:id", isAuthenticated, authorizeRoles("admin"), getCategoryById);

router.patch(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  validate(updateCategorySchema),
  updateCategory,
);

router.delete("/:id", isAuthenticated, authorizeRoles("admin"), deleteCategory);

export default router;
