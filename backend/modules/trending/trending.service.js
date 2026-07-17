import Post from "../post/post.model.js";
import { getPostLikeCountsService } from "../like/like.service.js";
import { getCommentCountsForPostsService } from "../comment/comment.service.js";

// Higher gravity = old posts fall off the trending list faster.
// 1.5-1.8 is the classic Hacker News range; tune to taste.
const GRAVITY = 1.6;

// Candidate window: only posts published within this many days are even
// considered. This isn't strictly necessary (the decay formula would push
// old posts down anyway), but it keeps the candidate set — and therefore
// the batched count queries — bounded as your post count grows.
const CANDIDATE_WINDOW_DAYS = 30;

const computeHotScore = (post, likeCount, commentCount) => {
  const hoursSincePublished = Math.max(
    (Date.now() - new Date(post.publishedAt).getTime()) / (1000 * 60 * 60),
    0,
  );
  const engagementScore = post.viewsCount + likeCount * 3 + commentCount * 2;
  return engagementScore / Math.pow(hoursSincePublished + 2, GRAVITY);
};

export const getTrendingPostsService = async (limit = 10) => {
  const windowStart = new Date(
    Date.now() - CANDIDATE_WINDOW_DAYS * 24 * 60 * 60 * 1000,
  );

  const candidates = await Post.find({
    status: "published",
    publishedAt: { $gte: windowStart },
  })
    .populate("author", "username")
    .populate("categories", "name")
    .select("title slug coverImage viewsCount publishedAt author categories");

  if (candidates.length === 0) return [];

  const postIds = candidates.map((p) => p._id);

  // Batched — 2 queries total, regardless of how many candidate posts there are
  const [likeCounts, commentCounts] = await Promise.all([
    getPostLikeCountsService(postIds),
    getCommentCountsForPostsService(postIds),
  ]);

  const scored = candidates.map((post) => {
    const likeCount = likeCounts[post._id.toString()] || 0;
    const commentCount = commentCounts[post._id.toString()] || 0;
    return {
      post,
      likeCount,
      commentCount,
      hotScore: computeHotScore(post, likeCount, commentCount),
    };
  });

  scored.sort((a, b) => {
    if (b.hotScore !== a.hotScore) return b.hotScore - a.hotScore;
    // Tiebreaker for equal scores (commonly all-zero-engagement posts) —
    // fall back to newest first rather than arbitrary DB order.
    return new Date(b.post.publishedAt) - new Date(a.post.publishedAt);
  });

  return scored.slice(0, limit);
};
