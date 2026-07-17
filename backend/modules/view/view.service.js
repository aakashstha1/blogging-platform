import ViewHistory from "./view.model.js";
import Post from "../post/post.model.js";

// Deduplicate views within this window
const VIEW_DEDUP_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

// Call this from the post detail route. Fire-and-forget from the controller
// (don't await it before responding) so it never slows down the page load.
export const recordViewService = async (userId, postId) => {
  // Guest: no identity to dedupe against, just count every hit.
  if (!userId) {
    await Post.findByIdAndUpdate(postId, { $inc: { viewsCount: 1 } });
    return;
  }

  const existing = await ViewHistory.findOne({ user: userId, post: postId });
  const isStale =
    !existing ||
    Date.now() - existing.viewedAt.getTime() > VIEW_DEDUP_WINDOW_MS;

  if (isStale) {
    await Post.findByIdAndUpdate(postId, { $inc: { viewsCount: 1 } });
  }

  // Always refresh viewedAt so "recently viewed" ordering stays accurate,
  // even on views that didn't count toward viewsCount.
  await ViewHistory.findOneAndUpdate(
    { user: userId, post: postId },
    { viewedAt: new Date() },
    { upsert: true, setDefaultsOnInsert: true },
  );
};

// Most recently viewed posts for a user — this is the raw material for the
// content-based recommendation feature (find posts similar to these).
export const getRecentlyViewedPostsService = async (userId, limit = 10) => {
  return await ViewHistory.find({ user: userId })
    .sort({ viewedAt: -1 })
    .limit(limit)
    .populate("post");
};
