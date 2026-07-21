import { deletePostLike } from "@/api/likeApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeletePostLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePostLike,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["single-post"],
      });
    },
  });
};
