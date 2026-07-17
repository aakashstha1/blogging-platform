import cron from "node-cron";
import { refreshCorpusVectorsService } from "../services/vectorize.service.js";

export const startVectorRefreshCron = () => {
  cron.schedule("*/10 * * * *", async () => {
    try {
      console.log("Refreshing corpus vectors...");

      const result = await refreshCorpusVectorsService();

      console.log(
        `Corpus refresh completed. Posts processed: ${result.postsProcessed}`,
      );
    } catch (error) {
      console.error("Corpus refresh failed:", error);
    }
  });
};
