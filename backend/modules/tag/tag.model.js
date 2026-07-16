import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      lowercase: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Tag", tagSchema);
