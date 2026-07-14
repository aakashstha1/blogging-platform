import { NotFoundError } from "../../utils/errors.js";
import User from "./user.model.js";

export const createUserService = async (userData) => {
  const user = await User.create(userData);
  return user;
};

export const getUsersService = async (req, res) => {
  const users = await User.find();
  if (users.length === 0) {
    throw new NotFoundError("No users found");
  }
  return users;
};

export const getUserByIdService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
};

export const updateUserByIdService = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
};

export const deleteUserByIdService = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
};