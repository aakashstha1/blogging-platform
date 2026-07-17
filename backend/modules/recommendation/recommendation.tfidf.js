// A small, deliberately non-exhaustive stopword list — just enough to strip
// common connective words that would otherwise dominate every document's
// vector and drown out the words that actually distinguish one post from another.
const STOPWORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "from",
  "as",
  "this",
  "that",
  "these",
  "those",
  "it",
  "its",
  "you",
  "your",
  "i",
  "we",
  "they",
  "he",
  "she",
  "his",
  "her",
  "them",
  "their",
  "our",
  "not",
  "no",
  "do",
  "does",
  "did",
  "have",
  "has",
  "had",
  "will",
  "would",
  "can",
  "could",
  "should",
  "may",
  "might",
  "if",
  "then",
  "so",
  "than",
  "too",
  "very",
  "just",
  "about",
  "into",
  "over",
]);

const tokenize = (text) => {
  return (text || "")
    .toLowerCase()
    .replace(/<[^>]+>/g, " ") // strip HTML tags if content is rich-text
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));
};

// Builds the raw "document" text for a post — title weighted more heavily
// by repeating it, since it's usually the most distinctive signal.
export const buildDocumentText = (post) => {
  const categoryNames = (post.categories || [])
    .map((c) => (typeof c === "object" ? c.name : ""))
    .join(" ");
  return `${post.title} ${post.title} ${categoryNames} ${post.content}`;
};

const termFrequency = (tokens) => {
  const tf = {};
  for (const token of tokens) {
    tf[token] = (tf[token] || 0) + 1;
  }
  const total = tokens.length || 1;
  for (const term in tf) {
    tf[term] = tf[term] / total;
  }
  return tf;
};

// documents: array of raw text strings (one per post)
// returns: { idf: {term: score}, tfVectors: [{term: tf}, ...] }
export const buildCorpusVectors = (documents) => {
  const tokenizedDocs = documents.map(tokenize);
  const tfVectors = tokenizedDocs.map(termFrequency);

  const docFrequency = {};
  for (const tokens of tokenizedDocs) {
    const uniqueTerms = new Set(tokens);
    for (const term of uniqueTerms) {
      docFrequency[term] = (docFrequency[term] || 0) + 1;
    }
  }

  const N = documents.length;
  const idf = {};
  for (const term in docFrequency) {
    idf[term] = Math.log(N / (1 + docFrequency[term])) + 1; // +1 smoothing
  }

  // Multiply tf by idf to get the final tf-idf vector per document
  const tfidfVectors = tfVectors.map((tf) => {
    const vector = {};
    for (const term in tf) {
      vector[term] = tf[term] * idf[term];
    }
    return vector;
  });

  return tfidfVectors;
};

export const cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  const terms = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
  for (const term of terms) {
    const a = vecA[term] || 0;
    const b = vecB[term] || 0;
    dotProduct += a * b;
    normA += a * a;
    normB += b * b;
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};
