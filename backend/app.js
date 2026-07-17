import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.send("Health check passed!");
});

import userRoutes from "./modules/user/user.route.js";
import authRoutes from "./modules/auth/auth.route.js";
import postRoutes from "./modules/post/post.route.js";
import categoryRoutes from "./modules/category/category.route.js";
import tagRoutes from "./modules/tag/tag.route.js";
import likeRoutes from "./modules/like/like.route.js";
import commentRoutes from "./modules/comment/comment.route.js";
import viewRoutes from "./modules/view/view.route.js";
import trendingRoutes from "./modules/trending/trending.route.js";
import recommendationRoutes from "./modules/recommendation/recommendation.route.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/tags", tagRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/views", viewRoutes);
app.use("/api/v1/trending", trendingRoutes);
app.use("/api/v1/recommendation", recommendationRoutes);

app.use(errorHandler);

export default app;
