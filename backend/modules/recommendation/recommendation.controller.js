import { getRecommendedPostsService } from "./recommendation.service.js";
export const getRecommendedPosts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    const result = await getRecommendedPostsService(req.userId, page, limit);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
