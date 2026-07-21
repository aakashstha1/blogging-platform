import api from "./axios";

export const createPostLike = async (postId) => {
  const { data } = await api.post(`/likes/posts/${postId}`);
  return data;
};

export const deletePostLike = async (postId) => {
  const { data } = await api.delete(`/likes/posts/${postId}`);
  return data;
};

export const getLikesByPostId = async () => {
  const { data } = await api.get("/likes/posts/counts");
  return data;
};

export const createCommentLike = async (commentId) => {
  const { data } = await api.post(`/likes/comments/${commentId}`);
  return data;
};

export const deleteCommentLike = async (commentId) => {
  const { data } = await api.delete(`/likes/comments/${commentId}`);
  return data;
};

export const getLikesByCommentId = async () => {
  const { data } = await api.get("/likes/comments/counts");
  return data;
};
