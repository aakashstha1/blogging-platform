import {
  deleteUserByIdService,
  getUserByIdService,
  getUsersService,
  updateUserByIdService,
} from "./user.service.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await getUsersService();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await updateUserByIdService(req.user._id, req.body, req.file);
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await deleteUserByIdService(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
