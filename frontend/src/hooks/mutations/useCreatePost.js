import { createPost } from "@/api/postApi";
import { useMutation } from "@tanstack/react-query";

export const useCreatePost = () => {
  return useMutation({
    mutationFn: createPost,
  });
};
