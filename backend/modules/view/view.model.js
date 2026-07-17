import mongoose from "mongoose";

const viewHistorySchema = new mongoose.Schema(
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
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

viewHistorySchema.index({ user: 1, post: 1 }, { unique: true });

viewHistorySchema.index({ user: 1, viewedAt: -1 });

export default mongoose.model("ViewHistory", viewHistorySchema);
