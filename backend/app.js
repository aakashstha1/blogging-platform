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

import userRoutes from "./modules/users/user.route.js";
import authRoutes from "./modules/auth/auth.route.js";
import postRoutes from "./modules/posts/post.route.js";
import categoryRoutes from "./modules/category/category.route.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/category", categoryRoutes);

app.use(errorHandler);

export default app;
