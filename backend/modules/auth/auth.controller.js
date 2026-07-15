import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateTokens.js";
import { createUserService } from "../users/user.service.js";

export const register = async (req, res, next) => {
  try {
    const user = await createUserService(req.body);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await loginUserService(req.body);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    sendAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    next(error);
  }
};
