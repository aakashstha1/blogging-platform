import { deleteImageFromCloudinary } from "../../helper/cloudinaryDelete.js";
import { updateSinglePostVectorService } from "../../services/vectorize.service.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import Post from "./post.model.js";
import { PostLike } from "../like/like.model.js";
import Category from "../category/category.model.js";
import slugify from "slugify";

const DRAFT_LIMIT_MESSAGE =
  "You already have a post in draft. Publish or delete it before starting a new one.";

// --------------------------------------------- Create a new post ---------------------------------------------
export const createPostService = async (userId, postData, file) => {
  if (!file) throw new BadRequestError("Cover image is required");

  const status = postData.status || "draft";

  if (status === "draft") {
    await assertNoExistingDraft(userId);
  }

  const slug = await buildUniqueSlug(postData.title);

  try {
    const post = await Post.create({
      ...postData,
      slug,
      author: userId,
      coverImage: file.path,
      coverImagePublicId: file.filename,
      status,
      publishedAt: status === "published" ? new Date() : null,
    });

    // Generate vector in background
    if (status === "published") {
      await updateSinglePostVectorService(post._id).catch(console.error);
    }

    return post;
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.status) {
      throw new BadRequestError(DRAFT_LIMIT_MESSAGE);
    }
    throw error;
  }
};

// --------------------------------------------- Get all posts ---------------------------------------------

export const getAllPostsService = async (query, user) => {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(parseInt(query.limit) || 10, 50);
  const skip = (page - 1) * limit;

  const filter = {};
  if (!user) {
    filter.status = "published";
  } else if (user.role !== "admin") {
    filter.$or = [{ status: "published" }, { author: user._id }];
  }

  // Only look up + filter by category if one was actually requested
  if (query.category) {
    const category = await Category.findOne({ slug: query.category });
    if (!category) {
      return { posts: [], page: 1, totalPages: 1, totalPosts: 0 };
    }
    filter.categories = category._id;
  }

  if (query.search) filter.$text = { $search: query.search };
  if (query.status && user?.role === "admin") filter.status = query.status;

  const findQuery = Post.find(filter)
    .populate("author", "username avatar")
    .populate("categories", "name")
    .populate("tags", "name")
    .populate("commentsCount")
    .populate("likesCount")
    .skip(skip)
    .limit(limit);

  if (query.search) {
    // Must project the score to be able to sort by it
    findQuery.select({ score: { $meta: "textScore" } });
    findQuery.sort({ score: { $meta: "textScore" } });
  } else {
    findQuery.sort({ publishedAt: -1, createdAt: -1 });
  }

  const [posts, total] = await Promise.all([
    findQuery,
    Post.countDocuments(filter),
  ]);

  return {
    posts,
    page,
    totalPages: Math.ceil(total / limit) || 1,
    totalPosts: total,
  };
};

// --------------------------------------------- Get a post by ID ---------------------------------------------
export const getPostByIdService = async (postId, user = null) => {
  const post = await Post.findById(postId)
    .populate("author", "username")
    .populate("categories", "name")
    .populate("tags", "name");

  if (!post) throw new NotFoundError("Post not found");

  const isOwner = user && post.author._id.toString() === user._id.toString();
  const isAdmin = user?.role === "admin";
  if (post.status !== "published" && !isOwner && !isAdmin) {
    // 404, not 403 — don't reveal that a draft exists to non-owners
    throw new NotFoundError("Post not found");
  }

  return post;
};

// --------------------------------------------- Get a post by slug ---------------------------------------------
export const getPostBySlugService = async (slug, user = null) => {
  const post = await Post.findOne({ slug })
    .populate("author", "username avatar")
    .populate("categories", "name")
    .populate("tags", "name")
    .populate("likesCount")
    .populate("commentsCount");

  if (!post) throw new NotFoundError("Post not found");

  const isOwner = user && post.author._id.toString() === user._id.toString();
  const isAdmin = user?.role === "admin";

  if (post.status !== "published" && !isOwner && !isAdmin) {
    throw new NotFoundError("Post not found");
  }

  let isLiked = false;

  if (user) {
    isLiked = !!(await PostLike.exists({
      user: user._id,
      post: post._id,
    }));
  }

  return {
    ...post.toObject(),
    isLiked,
  };
};

// --------------------------------------------- Update a post by ID ---------------------------------------------
export const updatePostService = async (post, updateData, file) => {
  if (updateData.title) {
    updateData.slug = await buildUniqueSlug(updateData.title, post._id);
  }

  if (file) {
    if (post.coverImagePublicId) {
      await deleteImageFromCloudinary(post.coverImagePublicId);
    }
    updateData.coverImage = file.path;
    updateData.coverImagePublicId = file.filename;
  }

  const updatedPost = await Post.findByIdAndUpdate(post._id, updateData, {
    new: true,
    runValidators: true,
  });

  if (updatedPost.status === "published") {
    updateSinglePostVectorService(updatedPost._id).catch(console.error);
  }

  return updatedPost;
};

// --------------------------------------------- Delete a post by ID ---------------------------------------------
export const deletePostService = async (post) => {
  if (post.coverImagePublicId) {
    await deleteImageFromCloudinary(post.coverImagePublicId);
  }
  await Post.findByIdAndDelete(post._id);
};

// --------------------------------------------- Publish a post ---------------------------------------------
export const publishPostService = async (post) => {
  if (post.status === "published") {
    throw new BadRequestError("Post is already published");
  }

  post.status = "published";
  post.publishedAt = new Date();
  await post.save();
  updateSinglePostVectorService(post._id).catch(console.error);
  return post;
};

// --------------------------------------------- Revert a post to draft ---------------------------------------------
// export const unpublishPostService = async (post) => {
//   if (post.status === "draft") {
//     throw new BadRequestError("Post is already a draft");
//   }

//   await assertNoExistingDraft(post.author._id, post._id);

//   post.status = "draft";
//   post.publishedAt = null;
//   await post.save();
//   return post;
// };

// --------------------------------------------- Assert no existing draft ---------------------------------------------
const assertNoExistingDraft = async (userId, excludePostId = null) => {
  const filter = { author: userId, status: "draft" };
  if (excludePostId) filter._id = { $ne: excludePostId };

  const existingDraft = await Post.findOne(filter);
  if (existingDraft) throw new BadRequestError(DRAFT_LIMIT_MESSAGE);
};

// --------------------------------------------- Build unique slug ---------------------------------------------
const buildUniqueSlug = async (title, excludeId = null) => {
  let slug = slugify(title, { lower: true, strict: true });
  const filter = excludeId ? { slug, _id: { $ne: excludeId } } : { slug };
  if (await Post.findOne(filter)) slug = `${slug}-${Date.now()}`;
  return slug;
};

// --------------------------------------------- Get my posts ---------------------------------------------
export const getMyPostsService = async (userId, query) => {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(parseInt(query.limit) || 10, 50);
  const skip = (page - 1) * limit;

  const filter = {
    author: userId,
  };

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .populate("author", "username avatar")
      .populate("categories", "name")
      .populate("tags", "name")
      .populate("commentsCount")
      .populate("likesCount")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit),

    Post.countDocuments(filter),
  ]);

  return {
    posts,
    page,
    totalPages: Math.ceil(total / limit) || 1,
    totalPosts: total,
  };
};
