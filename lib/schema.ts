import { z } from 'zod';

export const bookmarkSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(120, 'Title must be 120 characters or fewer'),
  url: z.string().url('Enter a valid URL'),
});

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signUpSchema = authSchema.extend({
  displayName: z.string().min(1),
  preferredLocale: z.enum(['en', 'ar']),
});

export const profileSchema = z.object({
  display_name: z
    .string()
    .min(1, 'Display name is required')
    .max(120, 'Display name must be 120 characters or fewer'),
  preferred_locale: z.enum(['en', 'ar']),
});

export type BookmarkInput = z.infer<typeof bookmarkSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
