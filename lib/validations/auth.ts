import { z } from "zod";

// -------------------------------------------------------------
// Authentication Validation Schemas
// -------------------------------------------------------------

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address.")
    .toLowerCase(),
  password: z.string().min(1, "Password cannot be empty."),
  rememberMe: z.boolean().optional().default(true),
});

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters.")
      .max(100, "Full name cannot exceed 100 characters."),
    email: z
      .string()
      .trim()
      .min(1, "Email address is required.")
      .email("Please enter a valid email address.")
      .toLowerCase(),
    phone: z.string().trim().max(30).optional(),
    password: z
      .string()
      .min(10, "Password must be at least 10 characters.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address.")
    .toLowerCase(),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(10, "Password must be at least 10 characters.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number."),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(10, "New password must be at least 10 characters.")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Must contain at least one number."),
    confirmNewPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match.",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password.",
    path: ["newPassword"],
  });

// -------------------------------------------------------------
// Profile & Address Validation Schemas
// -------------------------------------------------------------

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(100, "Full name cannot exceed 100 characters."),
  phone: z.string().trim().max(30).optional(),
});

export const addressSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Recipient name must be at least 2 characters.")
    .max(100),
  phone: z
    .string()
    .trim()
    .min(5, "Please enter a valid contact phone number.")
    .max(30),
  addressLine1: z
    .string()
    .trim()
    .min(3, "Street address is required.")
    .max(150),
  addressLine2: z.string().trim().max(150).optional(),
  city: z.string().trim().min(2, "City is required.").max(100),
  state: z.string().trim().min(2, "County / Region is required.").max(100),
  postalCode: z.string().trim().min(2, "Postal / ZIP code is required.").max(20),
  country: z.string().trim().min(2).max(100).default("United Kingdom"),
  isDefault: z.boolean().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
