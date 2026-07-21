import { getSinglePost } from "@/api/postApi";
import { useQuery } from "@tanstack/react-query";

export const useSinglePost = (slug) => {
  return useQuery({
    queryKey: ["single-post", slug],
    queryFn: () => getSinglePost(slug),
    enabled: !!slug,
  });
};
