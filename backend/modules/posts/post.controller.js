import { createPostService } from "./post.service.js";

export const createPost = async (req, res) => {
  const { title, content, slug, coverImage, categories, tags } = req.body;
  const post = await createPostService({
    title,
    content,
    slug,
    coverImage,
    categories,
    tags,
  });
  res.status(201).json(post);
};
