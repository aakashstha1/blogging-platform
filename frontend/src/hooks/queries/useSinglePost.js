import { getSinglePost } from "@/api/postApi";
import { useQuery } from "@tanstack/react-query";

export const useSinglePost = (slug) => {
  return useQuery({
    queryKey: ["singlePost", slug],
    queryFn: () => getSinglePost(slug),
    enabled: !!slug,
  });
};
