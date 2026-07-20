import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { formatTimeAgo } from "@/lib/timeFormat";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function PostCard({ post }) {
  const {
    slug,
    title,
    coverImage,
    // categories,
    content,
    author,
    publishedAt,
    likesCount = 0,
    commentsCount = 0,
  } = post;

  return (
    <Link
      to={`/posts/${slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-[#E8E4DC] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1F5F5B]/30 hover:shadow-lg hover:shadow-[#1C2321]/5 sm:flex-row"
    >
      {/* Cover image — full width on mobile, fixed width + full height on larger screens */}
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-[#E8E4DC] sm:aspect-auto sm:h-auto sm:w-80">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-[#1C2321]/30">
            No image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-6">
        {/* Header: avatar, username, time ago */}
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={author?.avatarUrl} alt={author?.username} />
            <AvatarFallback className="bg-[#1F5F5B] text-xs text-white">
              {initials(author?.username)}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 items-baseline gap-1.5 leading-tight">
            <span className="truncate text-sm font-medium text-[#1C2321]">
              {author?.username}
            </span>
            <span className="shrink-0 text-xs text-[#1C2321]/45">
              · {formatTimeAgo(publishedAt)}
            </span>
          </div>
        </div>

        {/* Title + truncated content */}
        <div className="flex flex-col gap-2">
          <h3 className="line-clamp-2 font-heading text-2xl leading-snug text-[#1C2321] transition-colors group-hover:text-[#1F5F5B]">
            {title}
          </h3>
          <p className="line-clamp-3 font-body text-base leading-relaxed text-[#1C2321]/60">
            {content}
          </p>
        </div>

        {/* Like / comment / save, bottom row */}
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center gap-5 text-sm text-[#1C2321]/50">
            <span className="flex items-center gap-1.5">
              <Heart className="h-4 w-4" /> {likesCount}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4" /> {commentsCount}
            </span>
          </div>
          <button
            onClick={(e) => e.preventDefault()}
            aria-label="Save post"
            className="text-[#1C2321]/40 transition-colors hover:text-[#1F5F5B]"
          >
            <Bookmark className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
