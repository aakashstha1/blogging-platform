import {
  createLikeService,
  getMyLikedPostService,
  unlikePostService,
} from "./like.service.js";

export const createLike = async (req, res, next) => {
  try {
    const like = await createLikeService(req.user._id, req.params.postId);

    res.status(201).json({
      message: "Post liked successfully",
      bookmark,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyLikedPost = async (req, res, next) => {
  try {
    const bookmarks = await getMyLikedPostService(req.user._id);

    res.status(200).json(bookmarks);
  } catch (error) {
    next(error);
  }
};

export const unlikePost = async (req, res, next) => {
  try {
    await unlikePostService(req.user._id, req.params.postId);

    res.status(200).json({
      message: "Post unliked successfully",
    });
  } catch (error) {
    next(error);
  }
};
