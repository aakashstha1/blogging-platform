import Post from "../post/post.model.js";
import { getRecentlyViewedPostsService } from "../view/view.service.js";
import { getMyLikedPostsService } from "../like/like.service.js";
import { getPostsCommentedByUserService } from "../comment/comment.service.js";
import { getTrendingPostsService } from "../trending/trending.service.js";
import { cosineSimilarityWithNorms } from "./recommendation.tfidf.js";

const RECENT_VIEWS_TO_CONSIDER = 10;
const RECENT_LIKES_TO_CONSIDER = 20;
const RECENT_COMMENTS_TO_CONSIDER = 20;

// Commenting takes real effort (strongest signal), liking is a single tap
// (medium signal), viewing costs the reader nothing (weakest but still
// meaningful signal).
const SIGNAL_WEIGHT = {
  view: 1.0,
  like: 1.5,
  comment: 1.8,
};

// --------------------------------- Build user profile ------------------------------------------------
const toPlainVector = (mapOrObject) => {
  if (!mapOrObject) return {};
  // .lean() queries return plain objects already; hydrated Mongoose docs
  // return a Map — handle both without caring which one we got.
  return mapOrObject instanceof Map
    ? Object.fromEntries(mapOrObject)
    : mapOrObject;
};

const buildUserProfile = (viewedPosts, likedPosts, commentedPosts) => {
  const profile = new Map();

  const addAll = (posts, weight) => {
    for (const post of posts) {
      if (!post || !post.vectorNorm) continue; // skip posts with no vector yet
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

// --------------------------------- Get recommended posts  ------------------------------------------------

export const getRecommendedPostsService = async (
  userId,
  page = 1,
  limit = 10,
) => {
  page = Math.max(Number(page) || 1, 1);
  limit = Math.min(Math.max(Number(limit) || 10, 1), 50);

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

  // Fallback: no engagement history
  if (profile.length === 0) {
    return getTrendingPostsService(page, limit);
  }

  const profileCategoryIds = [
    ...new Set(
      profile.flatMap((p) =>
        (p.post.categories || []).map((c) => c._id?.toString() || c.toString()),
      ),
    ),
  ];

  const candidateFilter = {
    status: "published",
    _id: { $nin: [...profilePostIds] },
    vectorNorm: { $gt: 0 },
  };

  if (profileCategoryIds.length > 0) {
    candidateFilter.categories = {
      $in: profileCategoryIds,
    };
  }

  const candidates = await Post.find(candidateFilter)
    .select(
      "title slug coverImage content viewsCount publishedAt author categories tfidfVector vectorNorm",
    )
    .populate("author", "username")
    .populate("categories", "name")
    .lean();

  // Fallback: no candidate posts
  if (candidates.length === 0) {
    return getTrendingPostsService(page, limit);
  }

  const profileVectors = profile.map((p) => ({
    vector: toPlainVector(p.post.tfidfVector),
    norm: p.post.vectorNorm,
    weight: p.weight,
  }));

  const scored = candidates.map((post) => {
    const candidateVector = toPlainVector(post.tfidfVector);

    let bestScore = 0;

    for (const entry of profileVectors) {
      const similarity = cosineSimilarityWithNorms(
        entry.vector,
        entry.norm,
        candidateVector,
        post.vectorNorm,
      );

      const weightedScore = similarity * entry.weight;

      if (weightedScore > bestScore) {
        bestScore = weightedScore;
      }
    }

    return {
      ...post,
      recommendationScore: bestScore,
    };
  });

  scored.sort((a, b) => b.recommendationScore - a.recommendationScore);

  const meaningful = scored.filter((post) => post.recommendationScore > 0);

  // Fallback: no meaningful recommendations
  if (meaningful.length === 0) {
    return getTrendingPostsService(page, limit);
  }

  const totalPosts = meaningful.length;
  const totalPages = Math.ceil(totalPosts / limit) || 1;

  const skip = (page - 1) * limit;

  const posts = meaningful.slice(skip, skip + limit);

  return {
    posts,
    page,
    totalPages,
    totalPosts,
  };
};
