import { createUserService } from "../users/user.service.js";

export const register = async (req, res, next) => {
  try {
    const user = await createUserService(req.body);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    next(error);
  }
};
