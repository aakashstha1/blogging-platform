import { getTrendingPostsService } from "./trending.service.js";

export const getTrendingPosts = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const trending = await getTrendingPostsService(limit);
    res.status(200).json({ posts: trending });
  } catch (error) {
    next(error);
  }
};
