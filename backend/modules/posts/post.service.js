import Post from "./post.model.js";
export const createPostService = async (postData) => {
  const post = await Post.create(postData);
  return post;
};
