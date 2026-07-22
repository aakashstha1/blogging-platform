import api from "./axios";

export const getPosts = async () => {
  const { data } = await api.get("/posts");
  return data;
};

// export const getPostBySlug = async (slug) => {
//   const { data } = await api.get(`/posts/${slug}`);
//   return data;
// };

export const getSinglePost = async (slug) => {
  const { data } = await api.get(`/posts/slug/${slug}`);
  return data;
};

export const getMyPosts = async ({ page = 1, limit = 6 }) => {
  const { data } = await api.get(`/posts/me?page=${page}&limit=${limit}`);

  return data;
};

export const createPost = async (formData) => {
  const { data } = await api.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const updatePost = async ({ formData, postId }) => {
  const { data } = await api.patch(`/posts/${postId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const deletePost = async (postId) => {
  const { data } = await api.delete(`/posts/${postId}`);

  return data;
};
