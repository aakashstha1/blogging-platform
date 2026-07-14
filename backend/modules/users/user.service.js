import { ConflictError, NotFoundError } from "../../utils/errors.js";
import User from "./user.model.js";
import bcryptjs from "bcryptjs";

export const createUserService = async (userData) => {
  const { username, email, password } = userData;
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ConflictError("User already exists with this username or email");
  }

  const passwordWithPepper = password + process.env.PEPPER;

  const hashedPassword = await bcryptjs.hash(passwordWithPepper, 10);

  const user = await User.create({
    ...userData,
    password: hashedPassword,
  });

  const { password: _, ...rest } = user.toObject();

  return rest;
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
