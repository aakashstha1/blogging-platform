import api from "./axios";

export const getTrendingPosts = async () => {
  const { data } = await api.get("/trending");
  return data;
};
