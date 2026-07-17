import { NotFoundError } from "../../utils/errors.js";
import Comment from "./comment.model.js";
import Post from "../post/post.model.js";

export const createCommentService = async (userId, commentData) => {
  const post = await Post.findById(commentData.post);
  if (!post) throw new NotFoundError("Post not found");

  if (commentData.parentComment) {
    const parent = await Comment.findById(commentData.parentComment);
    if (!parent) throw new NotFoundError("Parent comment not found");
    // guard against a reply pointing at a comment on a *different* post
    if (parent.post.toString() !== commentData.post) {
      throw new NotFoundError("Parent comment does not belong to this post");
    }
  }

  const comment = await Comment.create({ ...commentData, user: userId });
  return comment;
};

export const updateCommentByIdService = async (commentId, updateData) => {
  const comment = await Comment.findByIdAndUpdate(commentId, updateData, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!comment) throw new NotFoundError("Comment not found");
  return comment;
};

export const deleteCommentByIdService = async (commentId) => {
  const comment = await Comment.findByIdAndDelete(commentId);
  if (!comment) throw new NotFoundError("Comment not found");
};

export const getCommentByIdService = async (commentId) => {
  const comment = await Comment.findById(commentId)
    .populate("user", "username avatar")
    .populate("post", "title slug");
  if (!comment) throw new NotFoundError("Comment not found");
  return comment;
};

const paginate = (query) => {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(parseInt(query.limit) || 20, 100);
  return { page, limit, skip: (page - 1) * limit };
};

const paginatedFind = async (filter, query) => {
  const { page, limit, skip } = paginate(query);
  const [comments, total] = await Promise.all([
    Comment.find(filter)
      .populate("user", "username avatar")
      .populate("post", "title slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Comment.countDocuments(filter),
  ]);
  return {
    comments,
    page,
    totalPages: Math.ceil(total / limit) || 1,
    totalComments: total,
  };
};

export const getCommentsService = (query) => paginatedFind({}, query);

export const getCommentsByUserIdService = (userId, query) =>
  paginatedFind({ user: userId }, query);

// Top-level comments only by default — replies are fetched separately via
// getCommentsByParentCommentIdService, so a post page can load top-level
// comments first and lazy-load reply threads underneath each one.
export const getCommentsByPostIdService = (postId, query) =>
  paginatedFind({ post: postId, parentComment: null }, query);

export const getCommentsByParentCommentIdService = (parentCommentId, query) =>
  paginatedFind({ parentComment: parentCommentId }, query);

export const getCommentCountByPostIdService = (postId) =>
  Comment.countDocuments({ post: postId });

export const getCommentCountByParentCommentIdService = (parentCommentId) =>
  Comment.countDocuments({ parentComment: parentCommentId });

export const getCommentCountsForPostsService = async (postIds) => {
  const counts = await Comment.aggregate([
    { $match: { post: { $in: postIds } } },
    { $group: { _id: "$post", count: { $sum: 1 } } },
  ]);
  return Object.fromEntries(counts.map((c) => [c._id.toString(), c.count]));
};
