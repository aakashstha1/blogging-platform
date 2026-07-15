import { NotFoundError, UnauthorizedError } from "../../utils/errors.js";
import { getUserByUsernameService } from "../users/user.service.js";
import bcryptjs from "bcryptjs";
import User from "../users/user.model.js";
import jwt from "jsonwebtoken";

export const loginUserService = async (loginData) => {
  const { username, password } = loginData;
  const user = await getUserByUsernameService(username);

  const passwordWithPepper = password + process.env.PEPPER;

  const isPasswordMatch = await bcryptjs.compare(
    passwordWithPepper,
    user.password,
  );
  if (!isPasswordMatch) {
    throw new UnauthorizedError("Invalid username or password");
  }

  return user;
};

export const refreshAccessTokenService = async (refreshToken) => {
  if (!refreshToken) {
    throw new UnauthorizedError(
      "No refresh token provided, authorization denied",
    );
  }
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decoded.userId).select("+refreshToken");
  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (user.refreshToken !== refreshToken) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  return user;
};
