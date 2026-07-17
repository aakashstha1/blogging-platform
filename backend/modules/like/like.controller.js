import {
  createLikeService,
  getMyLikedPostsService,
  unlikePostService,
  getPostLikeCountService,
  createCommentLikeService,
  getMyLikedCommentsService,
  unlikeCommentService,
  getCommentLikeCountService,
} from "./like.service.js";

// ---------------------------------------------- Post likes ----------------------------------------------
export const createLike = async (req, res, next) => {
  try {
    const like = await createLikeService(req.user._id, req.params.postId);
    res.status(201).json({ message: "Post liked successfully", like });
  } catch (error) {
    next(error);
  }
};

export const getMyLikedPosts = async (req, res, next) => {
  try {
    const likes = await getMyLikedPostsService(req.user._id);
    res.status(200).json(likes);
  } catch (error) {
    next(error);
  }
};

export const unlikePost = async (req, res, next) => {
  try {
    await unlikePostService(req.user._id, req.params.postId);
    res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    next(error);
  }
};

export const getPostLikeCount = async (req, res, next) => {
  try {
    const count = await getPostLikeCountService(req.params.postId);
    res.status(200).json({ postId: req.params.postId, likeCount: count });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------- Comment likes ----------------------------------------------
export const createCommentLike = async (req, res, next) => {
  try {
    const like = await createCommentLikeService(
      req.user._id,
      req.params.commentId,
    );
    res.status(201).json({ message: "Comment liked successfully", like });
  } catch (error) {
    next(error);
  }
};

export const getMyLikedComments = async (req, res, next) => {
  try {
    const likes = await getMyLikedCommentsService(req.user._id);
    res.status(200).json(likes);
  } catch (error) {
    next(error);
  }
};

export const unlikeComment = async (req, res, next) => {
  try {
    await unlikeCommentService(req.user._id, req.params.commentId);
    res.status(200).json({ message: "Comment unliked successfully" });
  } catch (error) {
    next(error);
  }
};

export const getCommentLikeCount = async (req, res, next) => {
  try {
    const count = await getCommentLikeCountService(req.params.commentId);
    res.status(200).json({ commentId: req.params.commentId, likeCount: count });
  } catch (error) {
    next(error);
  }
};
