import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    avatar: {
      type: String,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
