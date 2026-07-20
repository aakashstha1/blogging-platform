import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateTokens.js";
import { sendAuthCookies } from "../../utils/sendAuthCookies.js";
import User from "../user/user.model.js";
import { createUserService } from "../user/user.service.js";
import { loginUserService, refreshAccessTokenService } from "./auth.service.js";

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

    res.status(200).json({ message: "Logged in successfully", user });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $unset: {
        refreshToken: 1,
      },
    });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const refreshToken = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies?.refreshToken;

    const user = await refreshAccessTokenService(oldRefreshToken);

    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    sendAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: "Tokens refreshed successfully",
    });
  } catch (error) {
    next(error);
  }
};
