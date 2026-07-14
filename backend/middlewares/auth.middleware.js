import { UnauthorizedError } from "../utils/errors.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    throw new UnauthorizedError("No token provided, authorization denied");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.id).select("-password");
    if (!user) {
      throw new AppError("User not found", 404);
    }
    req.user = user;
    next();
  } catch (err) {
    throw new UnauthorizedError("Invalid token, authorization denied");
  }

};
