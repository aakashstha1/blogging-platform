import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Pencil, Loader2, X, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleAvatarPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  function handleCancel() {
    setForm({
      username: user?.username || "",
      email: user?.email || "",
      bio: user?.bio || "",
    });
    setAvatarFile(null);
    setAvatarPreview(user?.avatar || "");
    setError("");
    setIsEditing(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (avatarFile) {
        const formData = new FormData();
        formData.append("username", form.username);
        formData.append("email", form.email);
        formData.append("bio", form.bio);
        formData.append("avatar", avatarFile);
        await updateProfile(formData);
      } else {
        await updateProfile(form);
      }
      setAvatarFile(null);
      setIsEditing(false);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Couldn't update your profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <form
        onSubmit={handleSave}
        className="rounded-xl border border-[#E8E4DC] bg-white p-6 sm:p-8"
      >
        {/* Header row: title + edit toggle */}
        <div className="mb-6 flex items-center justify-between">
          <h1
            className="text-2xl text-[#1C2321]"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Your profile
          </h1>
          {!isEditing && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="gap-1.5 border-[#1F5F5B]/30 text-[#1F5F5B]"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Button>
          )}
        </div>

        {error && (
          <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Avatar */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="relative">
            <Avatar className="h-28 w-28">
              <AvatarImage src={avatarPreview} alt={form.username} />
              <AvatarFallback className="bg-[#1F5F5B] text-2xl text-white">
                {initials(form.username)}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Change avatar"
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#1F5F5B] text-white shadow-sm hover:bg-[#1F5F5B]/90"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarPick}
                  className="hidden"
                />
              </>
            )}
          </div>
          {!isEditing && (
            <div className="text-center">
              <p className="text-lg font-medium text-[#1C2321]">
                {user?.username}
              </p>
              <p className="text-sm text-[#1C2321]/50">{user?.email}</p>
            </div>
          )}
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-5">
          {isEditing ? (
            <>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  minLength={3}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Tell readers a little about yourself..."
                  maxLength={280}
                  className="min-h-28"
                />
                <span className="self-end text-xs text-[#1C2321]/40">
                  {form.bio.length}/280
                </span>
              </div>
            </>
          ) : (
            <div className="rounded-lg bg-[#FAFAF8] p-4">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#1C2321]/40">
                Bio
              </p>
              <p className="text-sm leading-relaxed text-[#1C2321]/80">
                {user?.bio || "No bio yet."}
              </p>
            </div>
          )}
        </div>

        {/* Save / cancel */}
        {isEditing && (
          <div className="mt-7 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              disabled={saving}
              className="gap-1.5"
            >
              <X className="h-4 w-4" /> Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="gap-1.5 bg-[#1F5F5B] text-white hover:bg-[#1F5F5B]/90"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" /> Save changes
                </>
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
