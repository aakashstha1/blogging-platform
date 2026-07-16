import { ForbiddenError } from "../utils/errors.js";

export const checkOwnership = (resourceOwnerId, currentUser) => {
  if (currentUser.role === "admin") {
    return;
  }

  if (resourceOwnerId.toString() !== currentUser._id.toString()) {
    throw new ForbiddenError("You are not authorized to perform this action");
  }
};
