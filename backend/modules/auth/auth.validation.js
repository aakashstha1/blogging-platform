import { z } from "zod";

export const registerUserSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(
      /^[a-z0-9]+([._]?[a-z0-9]+)*$/,
      "Username can only contain letters, numbers, dots, and underscores",
    ),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export const loginUserSchema = z.object({
  username: z.string().trim().toLowerCase().min(1, "Username is required"),

  password: z.string().min(1, "Password is required"),
});
