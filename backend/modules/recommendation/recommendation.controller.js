import { getRecommendedPostsService } from "./recommendation.service.js";

export const getMyRecommendedPosts = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const posts = await getRecommendedPostsService(req.user._id, limit);
    res.status(200).json({ posts });
  } catch (error) {
    next(error);
  }
};
