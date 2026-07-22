import { Heart, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatTimeAgo } from "@/lib/timeFormat";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useNavigate, useParams } from "react-router-dom";
import { Eye } from "lucide-react";
import { useSinglePost } from "@/hooks/queries/useSinglePost";
import { Skeleton } from "../ui/skeleton";
import ScrollToTop from "./ScrollToTop";
import CommentSection from "./CommentSection";
import { useCreatePostLike } from "@/hooks/mutations/useCreatePostLike";
import { useDeletePostLike } from "@/hooks/mutations/useDeletePostLike";
import { MoreVertical } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useDeletePost } from "@/hooks/mutations/useDeletePost";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useState } from "react";

export default function SinglePost() {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const navigate = useNavigate();
  const { slug } = useParams();
  const { data, isLoading } = useSinglePost(slug);

  const { mutate: likePost } = useCreatePostLike();
  const { mutate: unlikePost } = useDeletePostLike();
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();

  const { user } = useAuth();

  const isOwner = user?._id === data?.author?._id;

  const handleEdit = () => {
    navigate(`/posts/edit/${data.slug}`);
  };

  const handleDelete = () => {
    deletePost(data._id, {
      onSuccess: () => {
        navigate("/my-posts");
      },
    });
  };

  if (isLoading) {
    return <SinglePostSkeleton />;
  }
  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-[#FAFAF8]">
        <article className="mx-auto max-w-7xl px-4 py-10">
          {/* Header */}
          <header className="mb-10">
            <h1 className="font-heading text-4xl font-semibold leading-tight text-[#1C2321] md:text-5xl">
              {data?.title}
            </h1>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={data?.author?.avatar} />
                  <AvatarFallback>{data?.author?.username?.[0]}</AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-medium text-[#1C2321]">
                    {data?.author?.username}
                  </p>

                  <p className="text-sm text-[#1C2321]/50">
                    {formatTimeAgo(data?.publishedAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-5 text-sm text-[#1C2321]/60">
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {data?.likesCount}
                  </span>

                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {data?.commentsCount}
                  </span>

                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {data?.viewsCount}
                  </span>
                </div>

                {isOwner && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <MoreVertical className="h-5 w-5 cursor-pointer" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleEdit}>
                        Edit Post
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-red-500"
                        onClick={() => setDeleteOpen(true)}
                      >
                        Delete Post
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </header>

          {/* Cover */}
          {data?.coverImage && (
            <div className="mb-12 overflow-hidden rounded-2xl">
              <img
                src={data?.coverImage}
                alt={data?.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none prose-img:rounded-xl text-justify font-body prose-p:mb-4 leading-8">
            <div
              dangerouslySetInnerHTML={{
                __html: data?.content,
              }}
            />
          </div>

          {/* Actions */}
          <div className="mt-12">
            <Separator />

            <div className="flex items-center justify-between py-5">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() =>
                    data?.isLiked ? unlikePost(data._id) : likePost(data._id)
                  }
                >
                  <Heart
                    className={data?.isLiked ? "fill-red-500 text-red-500" : ""}
                  />
                  {data?.isLiked ? "Liked" : "Like"}
                </Button>
              </div>

              {/* <Button variant="ghost">
                <Bookmark />
              </Button> */}
            </div>

            <Separator />
          </div>

          {/* Comments */}
          <section className="mt-12">
            <h2 className="mb-6 text-2xl font-semibold">
              Comments ({data?.commentsCount})
            </h2>

            {/* comment form */}
            {data && <CommentSection postId={data._id} />}

            {/* comment list */}
          </section>
        </article>
      </div>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

const SinglePostSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <article className="mx-auto max-w-4xl px-4 py-10">
        {/* Title */}
        <div className="mb-8 space-y-3">
          <Skeleton className="h-12 w-full max-w-3xl" />
          <Skeleton className="h-12 w-2/3" />
        </div>

        {/* Author + Stats */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>

          <div className="flex gap-5">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        {/* Cover image */}
        <Skeleton className="mb-12 h-[300px] w-full rounded-2xl md:h-[500px]" />

        {/* Content */}
        <div className="space-y-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-[95%]" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-[80%]" />

          <div className="py-4" />

          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-[92%]" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-[85%]" />
        </div>

        {/* Actions */}
        <div className="mt-12 flex items-center justify-between">
          <div className="flex gap-3">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-28 rounded-md" />
          </div>

          <Skeleton className="h-10 w-10 rounded-md" />
        </div>

        {/* Comments */}
        <div className="mt-12">
          <Skeleton className="mb-6 h-8 w-40" />

          <div className="space-y-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[85%]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};
