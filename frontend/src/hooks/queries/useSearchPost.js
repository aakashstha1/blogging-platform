import { getSearchedPosts } from "@/api/postApi";
import { useQuery } from "@tanstack/react-query";

export const useSearchPosts = (search) => {
  return useQuery({
    queryKey: ["posts", search],
    queryFn: () => getSearchedPosts(search),
    enabled: search.trim().length >= 2,
    staleTime: 1000 * 60,
  });
};
