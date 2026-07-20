import api from "./axios";

export const getRecommendedPosts = async () => {
  const { data } = await api.get("/recommendation/me");
  return data;
};
