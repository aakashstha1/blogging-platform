import Pagination from "@/components/common/Pagination";
import PostCard from "@/components/common/PostCard";
import PostCardSkeleton from "@/components/common/PostCardSkeleton";
import { useTrendingPosts } from "@/hooks/queries/useTrendingPosts";
import { useState } from "react";

function TrendingPosts() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useTrendingPosts({ page, limit: 6 });
  const posts = data?.posts ?? [];
  console.log(data);

  function handlePageChange(nextPage) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {isLoading ? (
        <div className="flex flex-col gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl py-20 text-center">
          <p className="text-[#1C2321]/70">No posts available.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-5">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>

          <Pagination
            page={data?.page ?? page}
            totalPages={data?.totalPages ?? 1}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default TrendingPosts;
