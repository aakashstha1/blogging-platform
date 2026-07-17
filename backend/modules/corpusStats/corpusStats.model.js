import mongoose from "mongoose";

// A single document holding the corpus-wide IDF map. Refreshed periodically
// by refreshCorpusVectors (see vectorizer.service.js), never computed live
// during a request. There is only ever one document in this collection.
const corpusStatsSchema = new mongoose.Schema(
  {
    idf: {
      type: Map,
      of: Number,
      default: {},
    },
    documentCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("CorpusStats", corpusStatsSchema);
