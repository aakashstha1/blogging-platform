import { useState } from "react";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { formatTimeAgo } from "@/lib/timeFormat";
import { Button } from "../ui/button";
import { useCreateComment } from "@/hooks/mutations/useCreateComment";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { useReplies } from "@/hooks/queries/useCommentReplies";

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

// Indent a little more per depth level, but cap it — past ~4 levels deep,
// continuing to indent makes replies unreadably narrow on smaller screens.
// NOTE: these must be full, literal class names — Tailwind's build only
// picks up classes it can find as exact strings in the source, so
// `ml-${depth * 4}` would silently generate no CSS at all.
const INDENT_CLASSES = [
  "",
  "ml-4 sm:ml-6",
  "ml-8 sm:ml-12",
  "ml-12 sm:ml-[4.5rem]",
  "ml-16 sm:ml-24",
];

function indentClass(depth) {
  return INDENT_CLASSES[Math.min(depth, INDENT_CLASSES.length - 1)];
}

export default function CommentItem({ comment, postId, depth = 0 }) {
  const { isAuthenticated } = useAuth();
  const [repliesExpanded, setRepliesExpanded] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");

  const repliesCount = comment.repliesCount ?? 0;
  const { data: repliesData, isLoading: repliesLoading } = useReplies(
    comment._id,
    {
      enabled: repliesExpanded,
    },
  );

  const { mutateAsync: createComment, isPending } = useCreateComment(postId);

  async function handleSubmitReply(e) {
    e.preventDefault();
    if (!replyText.trim()) return;
    await createComment({
      content: replyText.trim(),
      parentComment: comment._id,
    });
    setReplyText("");
    setShowReplyForm(false);
    setRepliesExpanded(true); // reveal the new reply immediately
  }

  return (
    <div className={indentClass(depth)}>
      <div className="flex gap-3 py-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage
            src={comment.user?.avatar}
            alt={comment.user?.username}
          />
          <AvatarFallback className="bg-[#1F5F5B] text-xs text-white">
            {initials(comment.user?.username)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#1C2321]">
              {comment.user?.username}
            </span>
            <span className="text-xs text-[#1C2321]/40">
              {formatTimeAgo(comment.createdAt)}
            </span>
          </div>
          <p className="mt-0.5 text-sm leading-relaxed text-[#1C2321]/80">
            {comment.content}
          </p>

          {/* Reply toggle + replies-count toggle */}
          <div className="mt-1.5 flex items-center gap-4 text-xs">
            {isAuthenticated && (
              <button
                onClick={() => setShowReplyForm((v) => !v)}
                className="font-medium text-[#1C2321]/50 hover:text-[#1F5F5B]"
              >
                Reply
              </button>
            )}
            {repliesCount > 0 && (
              <button
                onClick={() => setRepliesExpanded((v) => !v)}
                className="flex items-center gap-1 font-medium text-[#1F5F5B] hover:underline"
              >
                {repliesExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
                {repliesCount} {repliesCount === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>

          {/* Inline reply form */}
          {showReplyForm && (
            <form
              onSubmit={handleSubmitReply}
              className="mt-3 flex flex-col gap-2"
            >
              <Textarea
                autoFocus
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${comment.user?.username}...`}
                className="min-h-16 border-[#E8E4DC] text-sm"
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyText("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!replyText.trim() || isPending}
                  className="gap-1.5 bg-[#1F5F5B] text-white hover:bg-[#1F5F5B]/90"
                >
                  {isPending && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  Reply
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Replies — recursive, lazy-loaded only once expanded */}
      {repliesExpanded && (
        <div className="border-l border-[#E8E4DC] pl-2">
          {repliesLoading ? (
            <p className="py-2 pl-3 text-xs text-[#1C2321]/40">
              Loading replies...
            </p>
          ) : (
            repliesData?.comments.map((reply) => (
              <CommentItem
                key={reply._id}
                comment={reply}
                postId={postId}
                depth={depth + 1}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
