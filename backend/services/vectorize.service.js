import Post from "../modules/post/post.model.js";
import corpusStats from "../modules/corpusStats/corpusStats.model.js";
import {
  buildDocumentText,
  termFrequency,
  tokenize,
} from "../modules/recommendation/recommendation.tfidf.js";

const computeVectorFromTf = (tf, idf) => {
  const vector = {};
  let normSquared = 0;
  for (const term in tf) {
    const weight = tf[term] * (idf[term] ?? 0);
    if (weight === 0) continue;
    vector[term] = weight;
    normSquared += weight * weight;
  }
  return { vector, norm: Math.sqrt(normSquared) };
};

// --------------------------------------------- Full corpus refresh ---------------------------------------------
// Run this on a schedule (e.g. nightly cron) — NOT per request. Recomputes
// IDF across every published post, then recomputes and stores every post's
// tfidfVector + vectorNorm using the fresh IDF. This is the only place that
// does the expensive tokenize-everything work.
export const refreshCorpusVectorsService = async () => {
  const posts = await Post.find({ status: "published" }).select(
    "title content categories",
  );

  if (posts.length === 0) return { postsProcessed: 0 };

  const tokenizedDocs = posts.map((post) => tokenize(buildDocumentText(post)));
  const tfVectors = tokenizedDocs.map(termFrequency);

  const docFrequency = {};
  for (const tokens of tokenizedDocs) {
    for (const term of new Set(tokens)) {
      docFrequency[term] = (docFrequency[term] || 0) + 1;
    }
  }

  const N = posts.length;
  const idf = {};
  for (const term in docFrequency) {
    idf[term] = Math.log(N / (1 + docFrequency[term])) + 1;
  }

  await CorpusStats.findOneAndUpdate(
    {},
    { idf, documentCount: N },
    { upsert: true },
  );

  const bulkOps = posts.map((post, i) => {
    const { vector, norm } = computeVectorFromTf(tfVectors[i], idf);
    return {
      updateOne: {
        filter: { _id: post._id },
        update: { tfidfVector: vector, vectorNorm: norm },
      },
    };
  });

  await Post.bulkWrite(bulkOps);

  return { postsProcessed: posts.length };
};

// --------------------------------------------- Single-post update ---------------------------------------------
// Call this (fire-and-forget) right after a post is created, edited, or
// published — gives a brand-new/edited post an approximate vector
// immediately using the LAST cached IDF, rather than leaving it with no
// vector until the next scheduled full refresh.
export const updateSinglePostVectorService = async (postId) => {
  const [post, stats] = await Promise.all([
    Post.findById(postId).select("title content categories"),
    CorpusStats.findOne({}),
  ]);

  if (!post) return;

  // No corpus stats yet (e.g. very first post ever) — nothing to weight by.
  // The next full refresh will populate this properly.
  const idf = stats ? Object.fromEntries(stats.idf) : {};

  const tokens = tokenize(buildDocumentText(post));
  const tf = termFrequency(tokens);
  const { vector, norm } = computeVectorFromTf(tf, idf);

  await Post.findByIdAndUpdate(postId, {
    tfidfVector: vector,
    vectorNorm: norm,
  });
};
