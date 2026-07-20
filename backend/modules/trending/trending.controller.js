import { getTrendingPostsService } from "./trending.service.js";

export const getTrendingPosts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    const result = await getTrendingPostsService(page, limit);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
