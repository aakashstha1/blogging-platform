import rateLimit from "express-rate-limit";

const defaultConfig = {
  standardHeaders: true,
  legacyHeaders: false,
};

// --------------------------------------------- Auth ---------------------------------------------
export const loginRateLimiter = rateLimit({
  ...defaultConfig,
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Please try again in 15 minutes.",
  },
});

export const registerRateLimiter = rateLimit({
  ...defaultConfig,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    message: "Too many registration attempts. Please try again later.",
  },
});

export const refreshTokenRateLimiter = rateLimit({
  ...defaultConfig,
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many token refresh requests. Please try again later.",
  },
});

// --------------------------------------------- Posts ---------------------------------------------
export const createPostRateLimiter = rateLimit({
  ...defaultConfig,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    message: "Too many posts created. Please try again later.",
  },
});

export const updatePostRateLimiter = rateLimit({
  ...defaultConfig,
  windowMs: 60 * 60 * 1000,
  max: 60,
  message: {
    success: false,
    message: "Too many post updates. Please slow down.",
  },
});

export const deletePostRateLimiter = rateLimit({
  ...defaultConfig,
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many delete requests. Please try again later.",
  },
});

// --------------------------------------------- Likes ---------------------------------------------
export const interactionRateLimiter = rateLimit({
  ...defaultConfig,
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: {
    success: false,
    message: "Too many interactions. Please slow down.",
  },
});

// --------------------------------------------- Comments ---------------------------------------------
export const commentRateLimiter = rateLimit({
  ...defaultConfig,
  windowMs: 60 * 1000, // 1 minute
  max: 15,
  message: {
    success: false,
    message: "Too many comments. Please slow down.",
  },
});

// --------------------------------------------- Uploads ---------------------------------------------
export const uploadRateLimiter = rateLimit({
  ...defaultConfig,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: {
    success: false,
    message: "Upload limit exceeded. Please try again later.",
  },
});

// --------------------------------------------- Search ---------------------------------------------
export const searchRateLimiter = rateLimit({
  ...defaultConfig,
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many search requests. Please try again later.",
  },
});

// --------------------------------------------- Recommendations ---------------------------------------------
export const recommendationRateLimiter = rateLimit({
  ...defaultConfig,
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many recommendation requests. Please try again later.",
  },
});
