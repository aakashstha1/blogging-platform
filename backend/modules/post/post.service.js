import { checkOwnership } from "../../helper/checkOwnership.js";
import { deleteImageFromCloudinary } from "../../helper/cloudinaryDelete.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import Post from "./post.model.js";
import slugify from "slugify";

const DRAFT_LIMIT_MESSAGE =
  "You already have a post in draft. Publish or delete it before starting a new one.";

// --------------------------------------------- Create a new post ---------------------------------------------
export const createPostService = async (userId, postData, file) => {
  if (!file) {
    throw new BadRequestError("Cover image is required");
  }

  if (postData.status !== "published") {
    await assertNoExistingDraft(userId);
  }

  const slug = await buildUniqueSlug(postData.title);

  return await Post.create({
    ...postData,
    slug,
    author: userId,
    coverImage: file.path,
    coverImagePublicId: file.filename,
    publishedAt: postData.status === "published" ? new Date() : null,
  });
};

// --------------------------------------------- Get all posts ---------------------------------------------
export const getAllPostsService = async () => {
  const posts = await Post.find()
    .populate("author", "username")
    .populate("categories", "name")
    .populate("tags", "name")
    .sort({ createdAt: -1 });

  if (posts.length === 0) {
    throw new NotFoundError("No posts found");
  }
  return posts;
};

// --------------------------------------------- Get a post by ID ---------------------------------------------
export const getPostByIdService = async (postId, user = null) => {
  const post = await Post.findById(postId)
    .populate("author", "username")
    .populate("categories", "name")
    .populate("tags", "name");

  if (!post) {
    throw new NotFoundError("Post not found");
  }
  const isOwner = user && post.author._id.toString() === user._id.toString();
  const isAdmin = user?.role === "admin";
  if (post.status !== "published" && !isOwner && !isAdmin) {
    throw new NotFoundError("Post not found");
  }
  return post;
};

// --------------------------------------------- Update a post by ID ---------------------------------------------
export const updatePostService = async (post, updateData, file) => {
  const { title } = updateData;

  if (title) {
    updateData.slug = await buildUniqueSlug(title, post._id);
  }

  if (file) {
    await deleteImageFromCloudinary(post.coverImagePublicId);

    updateData.coverImage = file.path;
    updateData.coverImagePublicId = file.filename;
  }

  if (post.status === "published" && updateData.status === "draft") {
    throw new BadRequestError("Published posts cannot be reverted to draft");
  }

  return await Post.findByIdAndUpdate(post._id, updateData, {
    returnDocument: "after",
    runValidators: true,
  });
};

// --------------------------------------------- Delete a post by ID ---------------------------------------------
export const deletePostService = async (postId) => {
  const post = await getPostByIdService(postId);

  if (post.coverImagePublicId) {
    await deleteImageFromCloudinary(post.coverImagePublicId);
  }

  await Post.findByIdAndDelete(postId);
};

// --------------------------------------------- Publish a post by ID ---------------------------------------------
export const publishPostService = async (post, user) => {
  if (post.status === "published") {
    throw new BadRequestError("Post is already published");
  }
  checkOwnership(post.author._id, user);

  post.status = "published";
  post.publishedAt = new Date();
  await post.save();
  return post;
};

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

// --------------------------------------------- Increment view count ---------------------------------------------
export const incrementViewCountService = async (postId) => {
  await Post.findByIdAndUpdate(postId, { $inc: { viewsCount: 1 } });
};
