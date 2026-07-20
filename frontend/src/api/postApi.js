import api from "./axios";

export const getPosts = async () => {
  const { data } = await api.get("/posts");
  return data;
};

export const getPostBySlug = async (slug) => {
  const { data } = await api.get(`/posts/${slug}`);
  return data;
};
