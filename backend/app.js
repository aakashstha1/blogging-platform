import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errMiddleware from "./middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.send("Health check passed!");
});




app.use(errMiddleware);

export default app;
