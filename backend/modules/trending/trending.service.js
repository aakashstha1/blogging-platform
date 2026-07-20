import Post from "../post/post.model.js";
import { getPostLikeCountsService } from "../like/like.service.js";
import { getCommentCountsForPostsService } from "../comment/comment.service.js";

const GRAVITY = 1.6;
const CANDIDATE_WINDOW_DAYS = 30;

const computeHotScore = (post, likeCount, commentCount) => {
  const hoursSincePublished = Math.max(
    (Date.now() - new Date(post.publishedAt).getTime()) / (1000 * 60 * 60),
    0,
  );

  const engagementScore = post.viewsCount + likeCount * 3 + commentCount * 2;

  return engagementScore / Math.pow(hoursSincePublished + 2, GRAVITY);
};

export const getTrendingPostsService = async (page = 1, limit = 10) => {
  page = Math.max(Number(page) || 1, 1);
  limit = Math.min(Math.max(Number(limit) || 10, 1), 50);

  const windowStart = new Date(
    Date.now() - CANDIDATE_WINDOW_DAYS * 24 * 60 * 60 * 1000,
  );

  const candidates = await Post.find({
    status: "published",
    publishedAt: { $gte: windowStart },
  })
    .populate("author", "username")
    .populate("categories", "name")
    .select(
      "title slug content coverImage viewsCount publishedAt author categories",
    );

  if (candidates.length === 0) {
    return {
      posts: [],
      page,
      totalPages: 1,
      totalPosts: 0,
    };
  }

  const postIds = candidates.map((post) => post._id);

  const [likeCounts, commentCounts] = await Promise.all([
    getPostLikeCountsService(postIds),
    getCommentCountsForPostsService(postIds),
  ]);

  const scored = candidates.map((post) => {
    const likesCount = likeCounts[post._id.toString()] || 0;

    const commentsCount = commentCounts[post._id.toString()] || 0;

    return {
      ...post.toObject(),
      likesCount,
      commentsCount,
      hotScore: computeHotScore(post, likesCount, commentsCount),
    };
  });

  scored.sort((a, b) => {
    if (b.hotScore !== a.hotScore) {
      return b.hotScore - a.hotScore;
    }

    return new Date(b.publishedAt) - new Date(a.publishedAt);
  });

  const totalPosts = scored.length;
  const totalPages = Math.ceil(totalPosts / limit) || 1;

  const skip = (page - 1) * limit;

  const posts = scored.slice(skip, skip + limit);

  return {
    posts,
    page,
    totalPages,
    totalPosts,
  };
};
