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
  const { data } = await api.get(`/posts/${slug}`);
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
