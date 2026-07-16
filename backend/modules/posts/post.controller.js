import {
  createPostService,
  getAllPostsService,
  getPostByIdService,
  updatePostService,
  deletePostService,
} from "./post.service.js";

export const createPost = async (req, res, next) => {
  try {
    const post = await createPostService(req.user._id, {
      ...req.body,
      coverImg: req.file?.path,
    });
    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await getAllPostsService();
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await getPostByIdService(req.params.id);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await updatePostService(req.params.id, req.body);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res) => {
  const post = await deletePostService(req.params.id);

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  res.status(200).json({
    message: "Post deleted successfully",
  });
};
