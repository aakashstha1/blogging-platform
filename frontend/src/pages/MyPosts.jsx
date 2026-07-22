import Pagination from "@/components/common/Pagination";
import PostCard from "@/components/common/PostCard";
import PostCardSkeleton from "@/components/common/PostCardSkeleton";
import { useMyPosts } from "@/hooks/queries/useMyPosts";
import { useState } from "react";


function MyPosts() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useMyPosts({
    page,
    limit: 6,
  });

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
      ) : data?.posts?.length === 0 ? (
        <div className="py-20 text-center">
          <p>You haven't created any posts yet.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-5">
            {data?.posts?.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          <Pagination
            page={data?.page}
            totalPages={data?.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default MyPosts;
