import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "@/api/commentsApi";

export function useCreateComment(postId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ content, parentComment }) =>
      createComment(postId, {
        content,
        parentComment,
      }),

    onSuccess: (comment) => {
      if (comment.parentComment) {
        queryClient.invalidateQueries({
          queryKey: ["comments", "replies", comment.parentComment],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["comments", "post", postId],
        });
      }

      // refresh post data
      queryClient.invalidateQueries({
        queryKey: ["single-post"],
      });
    },
  });
}
