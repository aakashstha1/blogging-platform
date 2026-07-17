import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

// post comes from the URL param (/posts/:postId/comments), not the body
export const createCommentSchema = z.object({
  content: z.string().trim().min(1, "Content is required").max(1000),
  parentComment: objectIdSchema.optional(),
});

// post/parentComment can't change on update — only the text itself
export const updateCommentSchema = z.object({
  content: z.string().trim().min(1, "Content is required").max(1000),
});
