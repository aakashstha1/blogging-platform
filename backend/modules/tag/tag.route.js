import express from "express";

import { validate } from "../../middlewares/validate.middleware.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";

import { authorizeRoles } from "../../middlewares/role.middleware.js";
import { createTagSchema, updateTagSchema } from "./tag.validation.js";
import {
  createTag,
  deleteTag,
  getTagById,
  getTags,
  updateTag,
} from "./tag.controller.js";

const router = express.Router();

router.get("/", isAuthenticated, getTags);
router.post(
  "/",
  isAuthenticated,
  authorizeRoles("admin"),
  validate(createTagSchema),
  createTag,
);

router.get("/:id", isAuthenticated, authorizeRoles("admin"), getTagById);

router.patch(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  validate(updateTagSchema),
  updateTag,
);

router.delete("/:id", isAuthenticated, authorizeRoles("admin"), deleteTag);

export default router;
