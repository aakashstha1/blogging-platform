import { useQuery } from "@tanstack/react-query";
import { getTags } from "@/api/tagsApi";

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  });
}
