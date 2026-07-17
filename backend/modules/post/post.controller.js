import {
  checkOwnership,
  checkOwnershipOrAdmin,
} from "../../helper/checkOwnership.js";
import { recordViewService } from "../view/view.service.js";
import {
  createPostService,
  getAllPostsService,
  getPostByIdService,
  updatePostService,
  deletePostService,
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
    const result = await getAllPostsService(req.query, req.user);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------- Get post by id ---------------------------------------------
export const getPostById = async (req, res, next) => {
  try {
    const post = await getPostByIdService(req.params.id, req.user);
    recordViewService(req.user?._id, result.post._id).catch(() => {});
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------- Update post by id ---------------------------------------------
export const updatePost = async (req, res, next) => {
  try {
    const post = await getPostByIdService(req.params.id, req.user);
    checkOwnership(post.author._id, req.user);
    const updatedPost = await updatePostService(post, req.body, req.file);
    res.status(200).json({ message: "Post updated successfully", updatedPost });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------- Delete post by id ---------------------------------------------
export const deletePost = async (req, res, next) => {
  try {
    const post = await getPostByIdService(req.params.id, req.user);
    checkOwnershipOrAdmin(post.author._id, req.user);
    await deletePostService(post);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------- Publish post by id ---------------------------------------------
export const publishPost = async (req, res, next) => {
  try {
    const post = await getPostByIdService(req.params.id, req.user);
    checkOwnership(post.author._id, req.user);
    const updatedPost = await publishPostService(post);
    res
      .status(200)
      .json({ message: "Post published successfully", updatedPost });
  } catch (error) {
    next(error);
  }
};

// export const unpublishPost = async (req, res, next) => {
//   try {
//     const post = await getPostByIdService(req.params.id, req.user);
//     checkOwnership(post.author._id, req.user);
//     const updatedPost = await unpublishPostService(post);
//     res.status(200).json({ message: "Post moved back to draft", updatedPost });
//   } catch (error) {
//     next(error);
//   }
// };
