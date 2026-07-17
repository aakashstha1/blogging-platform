import {
  checkOwnership,
  checkOwnershipOrAdmin,
} from "../../helper/checkOwnership.js";
import {
  createCommentService,
  updateCommentByIdService,
  deleteCommentByIdService,
  getCommentByIdService,
  getCommentsService,
  getCommentsByPostIdService,
  getCommentsByUserIdService,
  getCommentCountByPostIdService,
  getCommentCountByParentCommentIdService,
} from "./comment.service.js";

export const createComment = async (req, res, next) => {
  try {
    // post ID comes from the URL (/posts/:postId/comments), merged with the
    // validated body (content, optional parentComment)
    const commentData = { ...req.body, post: req.params.postId };
    const comment = await createCommentService(req.user._id, commentData);
    res.status(201).json({ message: "Comment created successfully", comment });
  } catch (error) {
    next(error);
  }
};

// Edit: author only, same tier as post edit — not open to admin.
export const updateComment = async (req, res, next) => {
  try {
    const comment = await getCommentByIdService(req.params.commentId);
    checkOwnership(comment.user._id, req.user);
    const updated = await updateCommentByIdService(
      req.params.commentId,
      req.body,
    );
    res
      .status(200)
      .json({ message: "Comment updated successfully", comment: updated });
  } catch (error) {
    next(error);
  }
};

// Delete: author or admin — admin can moderate/remove any comment.
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await getCommentByIdService(req.params.commentId);
    checkOwnershipOrAdmin(comment.user._id, req.user);
    await deleteCommentByIdService(req.params.commentId);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getCommentById = async (req, res, next) => {
  try {
    const comment = await getCommentByIdService(req.params.commentId);
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const result = await getCommentsService(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getCommentsByPostId = async (req, res, next) => {
  try {
    const result = await getCommentsByPostIdService(
      req.params.postId,
      req.query,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// "My own comments" — self-scoped via req.user, not an arbitrary :userId param.
// If you also want to look up another user's comments publicly, add a
// separate route like GET /users/:userId/comments using req.params.userId.
export const getCommentsByUserId = async (req, res, next) => {
  try {
    const result = await getCommentsByUserIdService(req.user._id, req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getCommentCountForPost = async (req, res, next) => {
  try {
    const count = await getCommentCountByPostIdService(req.params.postId);
    res.status(200).json({ postId: req.params.postId, commentCount: count });
  } catch (error) {
    next(error);
  }
};

export const getCommentCountForParentComment = async (req, res, next) => {
  try {
    const count = await getCommentCountByParentCommentIdService(
      req.params.commentId,
    );
    res
      .status(200)
      .json({ parentCommentId: req.params.commentId, commentCount: count });
  } catch (error) {
    next(error);
  }
};
