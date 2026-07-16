import { ForbiddenError } from "../utils/errors.js";

// Strict: only the author may proceed. Admins are NOT exempt.
// Use for: editing content, publish/unpublish.
export const checkOwnership = (authorId, user) => {
  if (!user || authorId.toString() !== user._id.toString()) {
    throw new ForbiddenError(
      "You do not have permission to perform this action",
    );
  }
};

// Relaxed: author OR admin may proceed.
// Use for: delete (and view, though view privacy is handled in the service layer).
export const checkOwnershipOrAdmin = (authorId, user) => {
  if (!user) {
    throw new ForbiddenError(
      "You do not have permission to perform this action",
    );
  }
  const isOwner = authorId.toString() === user._id.toString();
  const isAdmin = user.role === "admin";
  if (!isOwner && !isAdmin) {
    throw new ForbiddenError(
      "You do not have permission to perform this action",
    );
  }
};
