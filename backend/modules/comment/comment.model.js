import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
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

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  { timestamps: true },
);
// Fast lookups for comments belonging to a post
commentSchema.index({ post: 1 });

// Fast lookups for comments by a user
commentSchema.index({ user: 1 });

// Fast lookups for replies
commentSchema.index({ parentComment: 1 });

export default mongoose.model("Comment", commentSchema);
