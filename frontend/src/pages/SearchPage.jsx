import { useSearchParams } from "react-router-dom";
import { useSearchPosts } from "@/hooks/queries/useSearchPost";
import PostCard from "@/components/common/PostCard";
import PostCardSkeleton from "@/components/common/PostCardSkeleton";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data, isLoading } = useSearchPosts(query);

  if (isLoading) {
    return <PostCardSkeleton />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-semibold">
        Search Results for "{query}"
      </h1>

      {data?.posts?.length > 0 ? (
        <div className="grid gap-6">
          {data.posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
}
