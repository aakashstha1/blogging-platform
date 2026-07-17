import http from "http";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

import app from "./app.js";
import connectDB from "./config/db-config.js";
import { startVectorRefreshCron } from "./cron/vectorRefresh.cron.js";

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

     startVectorRefreshCron();

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error(`Error starting server: ${err.message}`);
    process.exit(1);
  }
};

startServer();

process.on("SIGINT", () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
