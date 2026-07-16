import { getUserByIdService } from "../modules/user/user.service.js";
import { NotFoundError, UnauthorizedError } from "../utils/errors.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    throw new UnauthorizedError("No token provided, authorization denied");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getUserByIdService(decoded.userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    throw new UnauthorizedError("Invalid token, authorization denied");
  }
};
