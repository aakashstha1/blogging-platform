import { z } from "zod";

export const createTagSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name cannot exceed 100 characters")
      .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  })
  .strict();

export const updateTagSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name cannot exceed 100 characters")
      .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
      .optional(),
  })
  .strict();
