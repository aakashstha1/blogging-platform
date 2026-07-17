import Post from "../post/post.model.js";
<<<<<<< HEAD
import Like from "./like.model.js";
=======
import Comment from "../comment/comment.model.js";
import { PostLike, CommentLike } from "./like.model.js";
>>>>>>> 0742390384e91d8a90638f0975bd0563d6c54ff2
import { BadRequestError, NotFoundError } from "../../utils/errors.js";

// ---------------------------------------------- Post likes ----------------------------------------------
export const createLikeService = async (userId, postId) => {
  const post = await Post.findById(postId);
  if (!post) throw new NotFoundError("Post not found");

  const existingLike = await PostLike.findOne({ user: userId, post: postId });
  if (existingLike) throw new BadRequestError("Post already liked");

  return await PostLike.create({ user: userId, post: postId });
};

export const getMyLikedPostsService = async (userId) => {
  return await PostLike.find({ user: userId })
    .populate("post")
    .sort({ createdAt: -1 });
};

export const unlikePostService = async (userId, postId) => {
  const liked = await PostLike.findOneAndDelete({ user: userId, post: postId });
  if (!liked) throw new NotFoundError("You haven't liked this post");
};

export const getPostLikeCountService = async (postId) => {
  return await PostLike.countDocuments({ post: postId });
};

// Batched version for feeds — avoids one count query per post
export const getPostLikeCountsService = async (postIds) => {
  const counts = await PostLike.aggregate([
    { $match: { post: { $in: postIds } } },
    { $group: { _id: "$post", count: { $sum: 1 } } },
  ]);
  return Object.fromEntries(counts.map((c) => [c._id.toString(), c.count]));
};

// ---------------------------------------------- Comment likes ----------------------------------------------
export const createCommentLikeService = async (userId, commentId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new NotFoundError("Comment not found");

  const existingLike = await CommentLike.findOne({
    user: userId,
    comment: commentId,
  });
  if (existingLike) throw new BadRequestError("Comment already liked");

  return await CommentLike.create({ user: userId, comment: commentId });
};

export const getMyLikedCommentsService = async (userId) => {
  return await CommentLike.find({ user: userId })
    .populate("comment")
    .sort({ createdAt: -1 });
};

export const unlikeCommentService = async (userId, commentId) => {
  const liked = await CommentLike.findOneAndDelete({
    user: userId,
    comment: commentId,
  });
  if (!liked) throw new NotFoundError("You haven't liked this comment");
};

export const getCommentLikeCountService = async (commentId) => {
  return await CommentLike.countDocuments({ comment: commentId });
};

// Batched version — use when rendering a list of comments under a post
export const getCommentLikeCountsService = async (commentIds) => {
  const counts = await CommentLike.aggregate([
    { $match: { comment: { $in: commentIds } } },
    { $group: { _id: "$comment", count: { $sum: 1 } } },
  ]);
  return Object.fromEntries(counts.map((c) => [c._id.toString(), c.count]));
};
