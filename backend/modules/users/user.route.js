import express from "express";
import {
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "./user.controller.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
