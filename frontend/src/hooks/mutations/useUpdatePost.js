import { updatePost } from "@/api/postApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,

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
