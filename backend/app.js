import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.send("Health check passed!");
});

import userRoutes from "./modules/users/user.routes.js";

app.use("/api/v1/users", userRoutes);

app.use(errorHandler);

export default app;
