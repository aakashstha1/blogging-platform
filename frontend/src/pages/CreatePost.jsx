import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { useCategories } from "@/hooks/queries/useCategories";
import { useTags } from "@/hooks/queries/useTags";
import { useCreatePost } from "../hooks/mutations/useCreatePost";

export default function CreatePost() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { data: categories } = useCategories();

  const { data: tags, isLoading: tagsLoading } = useTags();
  const { mutateAsync: createPost } = useCreatePost();

  const [form, setForm] = useState({ title: "", content: "", category: "" });
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [error, setError] = useState("");
  // Track which action is submitting so only that button shows a spinner
  const [submitting, setSubmitting] = useState(null); // "draft" | "published" | null

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleCoverPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  function handleRemoveCover() {
    setCoverFile(null);
    setCoverPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function toggleTag(tagId) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  }

  async function handleSubmit(status) {
    setError("");

    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content are required.");
      return;
    }

    if (!coverFile) {
      setError("A cover image is required.");
      return;
    }

    setSubmitting(status);

    try {
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

      formData.append("coverImage", coverFile);

      const data = await createPost(formData);

      if (status === "published") {
        navigate(`/posts/${data.post.slug}`);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Couldn't save your post. Please try again.",
      );
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1
        className="mb-6 text-3xl text-[#1C2321]"
        style={{ fontFamily: "'Fraunces', Georgia, serif" }}
      >
        Write a new post
      </h1>

      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-6 rounded-xl border border-[#E8E4DC] bg-white p-6 sm:p-8">
        {/* Cover image */}
        <div className="flex flex-col gap-1.5">
          <Label>Cover image</Label>
          {coverPreview ? (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-[#E8E4DC]">
              <img
                src={coverPreview}
                alt="Cover preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveCover}
                aria-label="Remove cover image"
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/75"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#E8E4DC] text-[#1C2321]/50 transition-colors hover:border-[#1F5F5B]/40 hover:text-[#1F5F5B]"
            >
              <ImagePlus className="h-8 w-8" />
              <span className="text-sm">Click to upload a cover image</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverPick}
            className="hidden"
          />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Give your post a title"
            maxLength={200}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Write your post..."
            className="min-h-64"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category">Category</Label>
          <Select
            value={form.category}
            onValueChange={(value) =>
              setForm((f) => ({ ...f, category: value }))
            }
          >
            <SelectTrigger>
              {categories?.find((cat) => cat._id === form.category)?.name ||
                "Select a category"}
            </SelectTrigger>

            <SelectContent>
              {categories?.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tags — toggleable pills, fetched from backend */}
        <div className="flex flex-col gap-1.5">
          <Label>Tags</Label>
          {tagsLoading ? (
            <p className="text-sm text-[#1C2321]/50">Loading tags...</p>
          ) : tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag._id);
                return (
                  <button
                    key={tag._id}
                    type="button"
                    onClick={() => toggleTag(tag._id)}
                    className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                      isSelected
                        ? "border-[#1F5F5B] bg-[#1F5F5B] text-white"
                        : "border-[#E8E4DC] text-[#1C2321]/70 hover:border-[#1F5F5B]/40"
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-[#1C2321]/50">No tags available yet.</p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-2 flex justify-end gap-3 border-t border-[#E8E4DC] pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSubmit("draft")}
            disabled={submitting !== null}
            className="gap-1.5 border-[#1F5F5B]/30 text-[#1F5F5B]"
          >
            {submitting === "draft" && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Save as draft
          </Button>
          <Button
            type="button"
            onClick={() => handleSubmit("published")}
            disabled={submitting !== null}
            className="gap-1.5 bg-[#1F5F5B] text-white hover:bg-[#1F5F5B]/90"
          >
            {submitting === "published" && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}
