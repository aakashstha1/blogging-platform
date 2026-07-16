import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

// multipart/form-data sends arrays as JSON strings or comma-separated values —
// this normalizes both into a real array before validating
const toArray = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed)
        ? parsed
        : val.split(",").map((s) => s.trim());
    } catch {
      return val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
};

export const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(200),
  content: z.string().trim().min(1, "Content is required"),
  status: z.enum(["draft", "published"]).default("draft"),
  categories: z
    .preprocess(toArray, z.array(objectIdSchema))
    .optional()
    .default([]),
  tags: z.preprocess(toArray, z.array(objectIdSchema)).optional().default([]),
});

export const updatePostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(200)
    .optional(),
  content: z.string().trim().min(1, "Content is required").optional(),
  categories: z.preprocess(toArray, z.array(objectIdSchema)).optional(),
  tags: z.preprocess(toArray, z.array(objectIdSchema)).optional(),
});
