import { useQuery } from "@tanstack/react-query";
import { getReplies } from "@/api/commentsApi";

export function useReplies(commentId, { enabled = false } = {}) {
  return useQuery({
    queryKey: ["comments", "replies", commentId],
    queryFn: () => getReplies(commentId),
    enabled: enabled && !!commentId,
  });
}
