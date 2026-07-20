import { getRecommendedPosts } from "@/api/recommendedPostApi";
import { useQuery } from "@tanstack/react-query";

export const useRecommendedPosts = () => {
  return useQuery({
    queryKey: ["recommendedPosts"],
    queryFn: getRecommendedPosts,
  });
};
