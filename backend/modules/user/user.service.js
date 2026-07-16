import { deleteImageFromCloudinary } from "../../helper/cloudinaryDelete.js";
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

export const updateUserByIdService = async (userId, updateData, file) => {
  const user = await getUserByIdService(userId);

  const { username, email } = updateData;

  if (file) {
    if (user.avatarPublicId) {
      await deleteImageFromCloudinary(user.avatarPublicId);
    }

    updateData.avatar = file.path;
    updateData.avatarPublicId = file.filename;
  }

  if (username) {
    const existingUser = await User.findOne({
      username,
      _id: { $ne: userId },
    });
    if (existingUser) {
      throw new ConflictError("This username is already taken.");
    }
  }

  if (email) {
    const existingUser = await User.findOne({
      email,
      _id: { $ne: userId },
    });
    if (existingUser) {
      throw new ConflictError("This email is already registered.");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    returnDocument: "after",
    runValidators: true,
  });

  return updatedUser;
};

export const deleteUserByIdService = async (userId) => {
  const user = await getUserByIdService(userId);

  if (user.avatarPublicId) {
    await deleteImageFromCloudinary(user.avatarPublicId);
  }

  await User.findByIdAndDelete(userId);
};

export const getUserByUsernameService = async (username) => {
  const user = await User.findOne({ username }).select("+password");
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
};
