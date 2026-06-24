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

export type BookmarkInput = z.infer<typeof bookmarkSchema>;
