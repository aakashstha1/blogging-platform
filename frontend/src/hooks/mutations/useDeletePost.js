import { deletePost } from "@/api/postApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-posts"],
      });
    },
  });
};
