import { getPostsCommentedByUserService } from "../comment/comment.service.js";
import { getMyLikedPostsService } from "../like/like.service.js";
import Post from "../post/post.model.js";
import { getTrendingPostsService } from "../trending/trending.service.js";
import { getRecentlyViewedPostsService } from "../view/view.service.js";
import { buildCorpusVectors, buildDocumentText, cosineSimilarity } from "./recommendation.tfidf.js";

// How much of each source of interest to pull for the profile.
const RECENT_VIEWS_TO_CONSIDER = 10;
const RECENT_LIKES_TO_CONSIDER = 20;
const RECENT_COMMENTS_TO_CONSIDER = 20;

// Commenting takes real effort (strongest signal), liking is a single tap
// (medium signal), viewing costs the reader nothing (weakest signal but
// still meaningful — it's the only signal every user generates).
const SIGNAL_WEIGHT = {
  view: 1.0,
  like: 1.5,
  comment: 1.8,
};

// Builds a deduped map of postId -> { post, weight }, keeping the HIGHEST
// weight when a post shows up under multiple signals (e.g. viewed AND liked).
const buildUserProfile = (viewedPosts, likedPosts, commentedPosts) => {
  const profile = new Map();

  const addAll = (posts, weight) => {
    for (const post of posts) {
      if (!post) continue;
      const id = post._id.toString();
      const existing = profile.get(id);
      if (!existing || weight > existing.weight) {
        profile.set(id, { post, weight });
      }
    }
  };

  addAll(viewedPosts, SIGNAL_WEIGHT.view);
  addAll(likedPosts, SIGNAL_WEIGHT.like);
  addAll(commentedPosts, SIGNAL_WEIGHT.comment);

  return [...profile.values()];
};

export const getRecommendedPostsService = async (userId, limit = 10) => {
  const [recentViews, recentLikes, recentComments] = await Promise.all([
    getRecentlyViewedPostsService(userId, RECENT_VIEWS_TO_CONSIDER),
    getMyLikedPostsService(userId, RECENT_LIKES_TO_CONSIDER),
    getPostsCommentedByUserService(userId, RECENT_COMMENTS_TO_CONSIDER),
  ]);

  const viewedPosts = recentViews.map((v) => v.post).filter(Boolean);
  const likedPosts = recentLikes.map((l) => l.post).filter(Boolean);
  const commentedPosts = recentComments;

  const profile = buildUserProfile(viewedPosts, likedPosts, commentedPosts);
  const profilePostIds = new Set(profile.map((p) => p.post._id.toString()));

  // New user with no engagement of any kind — nothing to base a
  // recommendation on. Fall back to trending rather than an empty list.
  if (profile.length === 0) {
    const trending = await getTrendingPostsService(limit);
    return trending.map((t) => t.post);
  }

  // Candidate pool: all published posts NOT already in the user's profile
  // (already viewed/liked/commented on — no point recommending it again).
  const candidates = await Post.find({
    status: "published",
    _id: { $nin: [...profilePostIds] },
  })
    .populate("author", "username")
    .populate("categories", "name")
    .select(
      "title slug coverImage viewsCount publishedAt author categories content",
    );

  if (candidates.length === 0) return [];

  // Build TF-IDF over the combined set (profile posts + candidates) so IDF
  // weighting reflects the whole corpus, not just one side.
  const profileDocs = profile.map((p) => p.post);
  const allDocs = [...profileDocs, ...candidates];
  const allTexts = allDocs.map(buildDocumentText);
  const vectors = buildCorpusVectors(allTexts);

  const profileVectors = vectors.slice(0, profileDocs.length);
  const candidateVectors = vectors.slice(profileDocs.length);

  const scored = candidates.map((post, i) => {
    // Best WEIGHTED match across the whole profile — a candidate similar to
    // something the user commented on outranks one merely similar to
    // something they glanced at.
    const bestScore = Math.max(
      ...profile.map(
        (entry, j) =>
          cosineSimilarity(profileVectors[j], candidateVectors[i]) *
          entry.weight,
      ),
    );
    return { post, score: bestScore };
  });

  scored.sort((a, b) => b.score - a.score);

  // If nothing scored above zero (no shared vocabulary at all), fall back
  // to trending rather than showing 0%-match posts as if they were relevant.
  const meaningful = scored.filter((s) => s.score > 0);
  if (meaningful.length === 0) {
    const trending = await getTrendingPostsService(limit);
    return trending.map((t) => t.post);
  }

  return meaningful.slice(0, limit).map((s) => s.post);
};
