import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    coverImage: {
      type: String,
      required: true,
    },

    coverImagePublicId: {
      type: String,
      required: true,
    },

    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    viewsCount: {
      type: Number,
      default: 0,
    },

    publishedAt: {
      type: Date,
      default: null,
    },
    tfidfVector: {
      type: Map,
      of: Number,
      default: undefined,
      select: false,
    },
    vectorNorm: {
      type: Number,
      select: false,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

postSchema.index({ title: "text", content: "text" });

postSchema.index(
  { author: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "draft" } },
);

postSchema.virtual("commentsCount", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  count: true,
});

postSchema.virtual("likesCount", {
  ref: "PostLike",
  localField: "_id",
  foreignField: "post",
  count: true,
});

export default mongoose.model("Post", postSchema);
