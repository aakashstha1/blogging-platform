import Post from "../post/post.model.js";
import Like from "./like.model.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";

export const createLikeService = async (userId, postId) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new NotFoundError("Post not found");
  }

  const existingBookmark = await Like.findOne({
    user: userId,
    post: postId,
  });

  if (existingLike) {
    throw new BadRequestError("Post already liked");
  }

  return await Like.create({
    user: userId,
    post: postId,
  });
};

export const getMyLikedPostService = async (userId) => {
  return await Like.find({ user: userId })
    .populate("post")
    .sort({ createdAt: -1 });
};

export const unlikePostService = async (userId, postId) => {
  const liked = await Like.findOneAndDelete({
    user: userId,
    post: postId,
  });

  if (!liked) {
    throw new NotFoundError("Didnt liked");
  }
};
