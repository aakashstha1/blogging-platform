import api from "./axios";

export const getTags = async () => {
  const { data } = await api.get("/tags");
  return data;
};
