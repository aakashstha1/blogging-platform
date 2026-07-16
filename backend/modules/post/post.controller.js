import { checkOwnership } from "../../helper/checkOwnership.js";
import {
  createPostService,
  getAllPostsService,
  getPostByIdService,
  updatePostService,
  deletePostService,
  incrementViewCountService,
  publishPostService,
} from "./post.service.js";

// --------------------------------------------- Create a new post ---------------------------------------------
export const createPost = async (req, res, next) => {
  try {
    const post = await createPostService(req.user._id, req.body, req.file);
    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------- Get all posts ---------------------------------------------
export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await getAllPostsService();
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------- Get post by id ---------------------------------------------
export const getPostById = async (req, res, next) => {
  try {
    const post = await getPostByIdService(req.params.id, req.user);
    incrementViewCountService(post._id).catch(() => {}); // fire-and-forget, don't block the response
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------- Update post by id ---------------------------------------------
export const updatePost = async (req, res, next) => {
  try {
    const post = await getPostByIdService(req.params.id);

    checkOwnership(post.author._id, req.user);

    const updatedPost = await updatePostService(post, req.body, req.file);

    res.status(200).json({
      message: "Post updated successfully",
      updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------- Delete post by id ---------------------------------------------
export const deletePost = async (req, res, next) => {
  try {
    const post = await getPostByIdService(req.params.id);

    checkOwnership(post.author, req.user);

    await deletePostService(req.params.id);

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------- Publish post by id ---------------------------------------------
export const publishPost = async (req, res, next) => {
  try {
    const post = await getPostByIdService(req.params.id, req.user);

    const updatedPost = await publishPostService(post, req.user);
    res.status(200).json({
      message: "Post updated successfully",
      updatedPost,
    });
  } catch (error) {
    next(error);
  }
};
