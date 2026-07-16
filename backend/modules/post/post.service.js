import Post from "./post.model.js";
import slugify from "slugify";

export const createPostService = async (userId, postData) => {
  let slug = slugify(postData.title, {
    lower: true,
    strict: true,
  });

  const existingPost = await Post.findOne({ slug });

  if (existingPost) {
    slug = `${slug}-${Date.now()}`;
  }

  return await Post.create({
    ...postData,
    slug,
    author: userId,
  });
};

export const getAllPostsService = async () => {
  return await Post.find()
    .populate("author", "username")
    .populate("categories", "name")
    .populate("tags", "name")
    .sort({ createdAt: -1 });
};

export const getPostByIdService = async (id) => {
  return await Post.findById(id)
    .populate("author", "username")
    .populate("categories", "name")
    .populate("tags", "name");
};

export const updatePostService = async (id, updateData) => {
  return await Post.findByIdAndUpdate(id, updateData, {
    returnDocument: "after",
    runValidators: true,
  });
};

export const deletePostService = async (id) => {
  return await Post.findByIdAndDelete(id);
};
