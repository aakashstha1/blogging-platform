import { useParams, useNavigate } from "react-router-dom";
import PostForm from "@/components/form/PostForm";
import { useCategories } from "@/hooks/queries/useCategories";
import { useTags } from "@/hooks/queries/useTags";
import { useUpdatePost } from "@/hooks/mutations/useUpdatePost";
import { Skeleton } from "@/components/ui/skeleton";
import { useSinglePost } from "@/hooks/queries/useSinglePost";

export default function EditPost() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { data: post, isLoading } = useSinglePost(slug);

  const { data: categories } = useCategories();
  const { data: tags } = useTags();

  const { mutateAsync: updatePost } = useUpdatePost();

  if (isLoading) return <EditPostSkeleton />;

  const handleSubmit = async ({ status, form, coverFile, selectedTagIds }) => {
    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("status", status);

    if (form.category) {
      formData.append("categories", form.category);
    }

    selectedTagIds.forEach((tagId) => {
      formData.append("tags", tagId);
    });

    if (coverFile) {
      formData.append("coverImage", coverFile);
    }

    const data = await updatePost({
      postId: post._id,
      formData,
    });

    navigate(`/posts/${data.post.slug}`);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <PostForm
        initialData={post}
        categories={categories}
        tags={tags}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

function EditPostSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Skeleton className="mb-6 h-10 w-64" />

      <div className="space-y-6">
        <div>
          <Skeleton className="mb-2 h-5 w-24" />
          <Skeleton className="h-11 w-full" />
        </div>

        <div>
          <Skeleton className="mb-2 h-5 w-28" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>

        <div>
          <Skeleton className="mb-2 h-5 w-24" />
          <Skeleton className="h-11 w-full" />
        </div>

        <div>
          <Skeleton className="mb-2 h-5 w-20" />
          <Skeleton className="h-11 w-full" />
        </div>

        <Skeleton className="h-48 w-full rounded-lg" />

        <div className="flex justify-end gap-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}
