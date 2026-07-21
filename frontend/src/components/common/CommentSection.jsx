import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useComments } from "@/hooks/queries/useComments";
import { useCreateComment } from "@/hooks/mutations/useCreateComment";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import CommentItem from "./CommentItem";

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function CommentSection({ postId }) {
  const { user, isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const [commentText, setCommentText] = useState("");

  const { data, isLoading } = useComments(postId, page);
  const { mutateAsync: createComment } = useCreateComment(postId);
  async function handleSubmit(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    await createComment({
      content: commentText.trim(),
    });
    setCommentText("");
  }

  return (
    <div id="comments">
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8 flex gap-3">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarImage src={user?.avatar} alt={user?.username} />
            <AvatarFallback className="bg-[#1F5F5B] text-xs text-white">
              {initials(user?.username)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col gap-2">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="min-h-20 border-[#E8E4DC]"
            />
            <Button
              type="submit"
              size="sm"
              className="gap-1.5 self-end bg-[#1F5F5B] text-white hover:bg-[#1F5F5B]/90"
              disabled={!commentText.trim() || createComment.isPending}
            >
              {createComment.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Post comment
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-8 rounded-lg border border-[#E8E4DC] bg-white px-4 py-3 text-sm text-[#1C2321]/70">
          <Link
            to="/login"
            className="font-medium text-[#1F5F5B] hover:underline"
          >
            Log in
          </Link>{" "}
          to join the discussion.
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-[#1C2321]/40">Loading comments...</p>
      ) : data?.comments.length === 0 ? (
        <p className="text-sm text-[#1C2321]/50">
          No comments yet — be the first to say something.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-[#E8E4DC]">
          {data?.comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              postId={postId}
              depth={0}
            />
          ))}
        </div>
      )}

      {data?.totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-2 text-sm text-[#1C2321]/50">
            Page {data.page} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
