import PostForm from "@/components/form/PostForm";
import { useCreatePost } from "@/hooks/mutations/useCreatePost";
import { useCategories } from "@/hooks/queries/useCategories";
import { useTags } from "@/hooks/queries/useTags";
import { useNavigate } from "react-router-dom";


export default function CreatePost() {
  const navigate = useNavigate();

  const { data: categories } = useCategories();
  const { data: tags, isLoading: tagsLoading } = useTags();

  const { mutateAsync: createPost } = useCreatePost();

  const handleSubmit = async ({ status, form, coverFile, selectedTagIds }) => {
    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("content", form.content); // HTML from Tiptap
    formData.append("status", status);

    if (form.category) {
      formData.append("categories", form.category);
    }

    selectedTagIds.forEach((tagId) => {
      formData.append("tags", tagId);
    });

    formData.append("coverImage", coverFile);

    const data = await createPost(formData);

    if (status === "published") {
      navigate(`/posts/${data.post.slug}`);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-semibold">Write a new post</h1>

      <PostForm
        categories={categories}
        tags={tags}
        tagsLoading={tagsLoading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
