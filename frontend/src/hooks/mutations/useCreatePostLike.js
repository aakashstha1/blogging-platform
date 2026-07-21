import { createPostLike } from "@/api/likeApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreatePostLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPostLike,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["single-post"],
      });
    },
  });
};
