import { z } from 'zod';

export const userIdSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .strict();

const userUpdateBaseSchema = z.object({
  name: z.string().min(2).max(255).trim(),
  email: z.email().max(255).toLowerCase().trim(),
  role: z.enum(['user', 'admin']),
});

export const updateUserSchema = userUpdateBaseSchema.partial().strict();
