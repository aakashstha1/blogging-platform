import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    avatar: {
      type: String,
      default: null,
    },

    avatarPublicId: {
      type: String,
      default: null,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },

    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
