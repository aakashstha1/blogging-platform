import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Loader2, ImagePlus, X } from "lucide-react";
import TiptapEditor from "../common/TipTapEditor";

export default function PostForm({ categories, tags, onSubmit }) {
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
  });

  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [submitting, setSubmitting] = useState(null);

  const toggleTag = (tagId) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const handleCoverPick = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleRemoveCover = () => {
    setCoverFile(null);
    setCoverPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const submit = async (status) => {
    setSubmitting(status);

    try {
      await onSubmit({
        status,
        form,
        coverFile,
        selectedTagIds,
      });
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-[#E8E4DC] bg-white p-6 sm:p-8">
      {/* Cover */}
      <div className="flex flex-col gap-1.5">
        <Label>Cover image</Label>

        {coverPreview ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-[#E8E4DC]">
            <img
              src={coverPreview}
              alt=""
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
            className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#E8E4DC] text-[#1C2321]/50 transition-colors hover:border-[#1F5F5B]/40 hover:text-[#1F5F5B]"
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
        <Label htmlFor="post-title">Title</Label>

        <Input
          id="post-title"
          placeholder="Give your post a title"
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5">
        <Label>Content</Label>

        <TiptapEditor
          value={form.content}
          onChange={(content) =>
            setForm((prev) => ({
              ...prev,
              content,
            }))
          }
        />
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="post-category">Category</Label>

        <Select
          value={form.category}
          onValueChange={(value) =>
            setForm((prev) => ({
              ...prev,
              category: value,
            }))
          }
        >
          <SelectTrigger>
            {categories?.find((c) => c._id === form.category)?.name ||
              "Select category"}
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

      {/* Tags */}
      <div className="flex flex-col gap-1.5">
        <Label>Tags</Label>

        <div className="flex flex-wrap gap-2">
          {tags?.map((tag) => {
            const selected = selectedTagIds.includes(tag._id);

            return (
              <button
                key={tag._id}
                type="button"
                onClick={() => toggleTag(tag._id)}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                  selected
                    ? "border-[#1F5F5B] bg-[#1F5F5B] text-white"
                    : "border-[#E8E4DC] text-[#1C2321]/70 hover:border-[#1F5F5B]/40"
                }`}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-2 flex justify-end gap-3 border-t border-[#E8E4DC] pt-6">
        <Button
          variant="outline"
          disabled={submitting !== null}
          onClick={() => submit("draft")}
          className="gap-1.5 border-[#1F5F5B]/30 text-[#1F5F5B]"
        >
          {submitting === "draft" && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          Save as draft
        </Button>

        <Button
          disabled={submitting !== null}
          onClick={() => submit("published")}
          className="gap-1.5 bg-[#1F5F5B] text-white hover:bg-[#1F5F5B]/90"
        >
          {submitting === "published" && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          Publish
        </Button>
      </div>
    </div>
  );
}
