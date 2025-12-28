import { z } from 'zod';

// Auth schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Event schemas
export const createEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  date: z.string().datetime('Invalid date format'),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  capacity: z.number().int().positive('Capacity must be a positive number'),
  location: z.string().min(3, 'Location must be at least 3 characters').max(200),
  categoryId: z.string().min(1, 'Category is required'),
});

export const updateEventSchema = createEventSchema.partial();

// Category schemas
export const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().max(500).optional().or(z.literal('')),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
