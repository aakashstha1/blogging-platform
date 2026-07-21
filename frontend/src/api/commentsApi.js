import api from "./axios";

export const getComments = async (postId, page = 1) => {
  const { data } = await api.get(`/comments/posts/${postId}?page=${page}`);

  return data;
};

export const createComment = async (postId, { content, parentComment }) => {
  const { data } = await api.post(`/comments/posts/${postId}`, {
    content,
    parentComment: parentComment || undefined,
  });
  return data;
};

export const getReplies = async (commentId) => {
  const { data } = await api.get(`/comments/${commentId}/replies`);
  return data;
};
