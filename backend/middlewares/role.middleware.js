import { ForbiddenError, NotFoundError } from "../utils/errors.js";

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new NotFoundError("User not found");
    }
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError("You are not authorized");
    }
    next();
  };
};
