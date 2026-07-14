import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(urlencoded({extended:true}));

app.get("/health", (req, res) => {
  res.send("Health check passed!");
});


export default app;
