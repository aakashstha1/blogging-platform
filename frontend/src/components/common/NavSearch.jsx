import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSearchPosts } from "@/hooks/queries/useSearchPost";

export default function NavSearch() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: searchResults, isFetching } = useSearchPosts(debouncedSearch);

  const close = () => {
    setOpen(false);
    setSearch("");
    setDebouncedSearch("");
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToResults = () => {
    navigate(`/search?q=${encodeURIComponent(search)}`);
    close();
  };

  return (
    <div ref={containerRef} className="relative hidden items-center sm:flex">
      {open ? (
        <div className="relative">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && search.trim()) goToResults();
            }}
            autoFocus
          />
          {isFetching && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
            </div>
          )}
        </div>
      ) : (
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <Search className="h-[18px] w-[18px]" />
        </Button>
      )}

      {debouncedSearch && (
        <div className="absolute top-full right-0 z-50 mt-2 max-h-96 w-80 overflow-y-auto rounded-lg border bg-white shadow-lg">
          {isFetching ? (
            <div className="p-3 text-sm">Searching...</div>
          ) : searchResults?.posts?.length > 0 ? (
            searchResults.posts.map((post) => (
              <Link
                key={post._id}
                to={`/posts/${post.slug}`}
                onClick={close}
                className="block border-b p-3 hover:bg-gray-50"
              >
                <p className="font-medium">{post.title}</p>
                <p className="text-sm text-muted-foreground">
                  {post.author?.username}
                </p>
              </Link>
            ))
          ) : (
            <div className="p-3 text-sm text-gray-500">No posts found</div>
          )}
          {searchResults?.posts?.length > 0 && (
            <button
              onClick={goToResults}
              className="w-full border-t p-3 text-center text-sm font-medium text-[#1F5F5B] hover:bg-gray-50"
            >
              View all results
            </button>
          )}
        </div>
      )}
    </div>
  );
}
