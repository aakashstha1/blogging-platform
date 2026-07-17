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
  getCommentCountByParentCommentIdService,
  getCommentCountByPostIdService,
} from "./comment.service.js";

export const createComment = async (req, res, next) => {
  try {
    const comment = await createCommentService(req.user._id, req.body);
    res.status(201).json({ message: "Comment created successfully", comment });
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const comment = await getCommentByIdService(req.params.id);
    checkOwnership(comment.user._id, req.user);
    const updated = await updateCommentByIdService(req.params.id, req.body);
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
    const comment = await getCommentByIdService(req.params.id);
    checkOwnershipOrAdmin(comment.user._id, req.user);
    await deleteCommentByIdService(req.params.id);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getCommentById = async (req, res, next) => {
  try {
    const comment = await getCommentByIdService(req.params.id);
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
    const result = await getCommentsByPostIdService(req.params.id, req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getCommentsByUserId = async (req, res, next) => {
  try {
    const result = await getCommentsByUserIdService(req.params.id, req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getCommentCountForPost = async (req, res, next) => {
  try {
    const count = await getCommentCountByPostIdService(req.params.id);
    res.status(200).json({ postId: req.params.id, commentCount: count });
  } catch (error) {
    next(error);
  }
};

export const getCommentCountForParentComment = async (req, res, next) => {
  try {
    const count = await getCommentCountByParentCommentIdService(req.params.id);
    res
      .status(200)
      .json({ parentCommentId: req.params.id, commentCount: count });
  } catch (error) {
    next(error);
  }
};
