import { useQuery } from "@tanstack/react-query";
import { getComments } from "@/api/commentsApi";

// Top-level comments for a post (parentComment: null on the backend).
export const useComments = (postId, page = 1) => {
  return useQuery({
    queryKey: ["comments", "post", postId, page],
    queryFn: () => getComments(postId, page),
    enabled: !!postId,
  });
};
