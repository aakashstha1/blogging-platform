import { getMyPosts } from "@/api/postApi";
import { useQuery } from "@tanstack/react-query";

export const useMyPosts = ({ page, limit }) => {
  return useQuery({
    queryKey: ["my-posts", page, limit],
    queryFn: () => getMyPosts({ page, limit }),
  });
};
