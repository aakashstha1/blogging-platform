import mongoose from "mongoose";

// ---------------------------------------------- Post Like ----------------------------------------------
const postLikeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true },
);

// A user can like a given post only once
postLikeSchema.index({ user: 1, post: 1 }, { unique: true });

export const PostLike = mongoose.model("PostLike", postLikeSchema);

// ---------------------------------------------- Comment Like ----------------------------------------------
const commentLikeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
  },
  { timestamps: true },
);

// A user can like a given comment only once
commentLikeSchema.index({ user: 1, comment: 1 }, { unique: true });

export const CommentLike = mongoose.model("CommentLike", commentLikeSchema);
