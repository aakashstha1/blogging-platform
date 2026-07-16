import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

export const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title cannot exceed 200 characters"),

  content: z.string().trim().min(1, "Content is required"),

  slug: z
    .string()
    .trim()
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),

  coverImage: z.url("Please provide a valid image URL"),

  categories: z.array(objectIdSchema),

  tags: z.array(objectIdSchema).optional().default([]),

  status: z.enum(["draft", "published"]).default("draft"),
});
