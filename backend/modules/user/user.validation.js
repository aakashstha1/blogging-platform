import { z } from "zod";

export const updateUserSchema = z
  .object({
    username: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot exceed 30 characters")
      .regex(
        /^[a-z0-9]+([._]?[a-z0-9]+)*$/,
        "Username can only contain letters, numbers, dots, and underscores",
      )
      .optional(),

    email: z
      .email("Invalid email address")
      .transform((email) => email.toLowerCase())
      .optional(),

    bio: z
      .string()
      .trim()
      .max(300, "Bio cannot exceed 300 characters")
      .optional(),

    avatar: z.string().url("Avatar must be a valid URL").optional(),
  })
  .strict();
