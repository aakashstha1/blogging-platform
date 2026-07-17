import mongoose from "mongoose";

const postLikedSchema = new mongoose.Schema(
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

postLikedSchema.index({ user: 1, post: 1 }, { unique: true });

export default mongoose.model("Liked", postLikedSchema);

const commentLikedSchema = new mongoose.Schema(
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
commentLikedSchema.index({ user: 1, comment: 1 }, { unique: true });

export default mongoose.model("Liked", commentLikedSchema);

