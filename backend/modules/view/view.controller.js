import { getRecentlyViewedPostsService } from "./view.service.js";

export const getMyRecentlyViewed = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const history = await getRecentlyViewedPostsService(req.user._id, limit);
    res.status(200).json(history);
  } catch (error) {
    next(error);
  }
};
