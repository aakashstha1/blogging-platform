import { getTrendingPosts } from "@/api/trendingPostAPi";
import { useQuery } from "@tanstack/react-query";

export const useTrendingPosts = () => {
  return useQuery({
    queryKey: ["trendingPosts"],
    queryFn: getTrendingPosts,
  });
};
