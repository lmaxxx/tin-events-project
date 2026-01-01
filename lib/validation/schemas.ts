import { z } from 'zod';

// Password schema factory
export function createPasswordSchema(t: (key: string, values?: any) => string) {
  return z
    .string()
    .min(8, t('validation.password.minLength', { min: 8 }))
    .max(100, t('validation.password.maxLength', { max: 100 }))
    .regex(/[a-z]/, t('validation.password.lowercase'))
    .regex(/[A-Z]/, t('validation.password.uppercase'))
    .regex(/[0-9]/, t('validation.password.number'))
    .regex(/[^a-zA-Z0-9]/, t('validation.password.special'));
}

// Safe URL schema factory
export function createSafeUrlSchema(t: (key: string, values?: any) => string) {
  return z
    .string()
    .url(t('validation.event.imageUrl.invalid'))
    .refine(
      (url) => {
        try {
          const parsed = new URL(url);
          return parsed.protocol === 'https:' || parsed.protocol === 'http:';
        } catch {
          return false;
        }
      },
      { message: t('validation.event.imageUrl.protocol') }
    );
}

// Register schema factory
export function createRegisterSchema(t: (key: string, values?: any) => string) {
  return z.object({
    name: z
      .string()
      .min(2, t('validation.name.minLength', { min: 2 }))
      .max(100, t('validation.name.maxLength', { max: 100 })),
    email: z.string().email(t('validation.email.invalid')),
    password: createPasswordSchema(t),
  });
}

// Login schema factory
export function createLoginSchema(t: (key: string, values?: any) => string) {
  return z.object({
    email: z.string().email(t('validation.email.invalid')),
    password: z.string().min(1, t('validation.password.required')),
  });
}

// Event schema factory
export function createEventSchema(t: (key: string, values?: any) => string) {
  return z.object({
    title: z
      .string()
      .min(3, t('validation.event.title.minLength', { min: 3 }))
      .max(200, t('validation.event.title.maxLength', { max: 200 })),
    description: z
      .string()
      .min(10, t('validation.event.description.minLength', { min: 10 }))
      .max(5000, t('validation.event.description.maxLength', { max: 5000 })),
    date: z.string().datetime(t('validation.event.date.invalid')),
    imageUrl: createSafeUrlSchema(t).optional().or(z.literal('')),
    capacity: z
      .number()
      .int(t('validation.event.capacity.integer'))
      .min(1, t('validation.event.capacity.min', { min: 1 }))
      .max(100000, t('validation.event.capacity.max', { max: 100000 })),
    location: z
      .string()
      .min(3, t('validation.event.location.minLength', { min: 3 }))
      .max(200, t('validation.event.location.maxLength', { max: 200 })),
    categoryId: z.string().min(1, t('validation.event.category.required')),
  });
}

// Category schema factory
export function createCategorySchema(t: (key: string, values?: any) => string) {
  return z.object({
    name: z
      .string()
      .min(2, t('validation.category.name.minLength', { min: 2 }))
      .max(100, t('validation.category.name.maxLength', { max: 100 })),
    description: z
      .string()
      .max(500, t('validation.category.description.maxLength', { max: 500 }))
      .optional()
      .or(z.literal('')),
  });
}

// Static schemas for backward compatibility (API routes)
// These use English error messages and will be migrated later
const defaultT = (key: string, values?: any) => {
  // Simplified English error messages for server-side validation
  const messages: Record<string, string> = {
    'validation.email.invalid': 'Invalid email address',
    'validation.password.required': 'Password is required',
    'validation.password.minLength': `Password must be at least ${values?.min || 8} characters`,
    'validation.password.maxLength': `Password must be less than ${values?.max || 100} characters`,
    'validation.password.lowercase': 'Password must contain at least one lowercase letter',
    'validation.password.uppercase': 'Password must contain at least one uppercase letter',
    'validation.password.number': 'Password must contain at least one number',
    'validation.password.special': 'Password must contain at least one special character',
    'validation.name.minLength': `Name must be at least ${values?.min || 2} characters`,
    'validation.name.maxLength': `Name must be less than ${values?.max || 100} characters`,
    'validation.event.title.minLength': `Title must be at least ${values?.min || 3} characters`,
    'validation.event.title.maxLength': `Title must be less than ${values?.max || 200} characters`,
    'validation.event.description.minLength': `Description must be at least ${values?.min || 10} characters`,
    'validation.event.description.maxLength': `Description must be less than ${values?.max || 5000} characters`,
    'validation.event.date.invalid': 'Invalid date format',
    'validation.event.capacity.integer': 'Capacity must be a whole number',
    'validation.event.capacity.min': `Capacity must be at least ${values?.min || 1}`,
    'validation.event.capacity.max': `Capacity must be less than ${values?.max || 100000}`,
    'validation.event.location.minLength': `Location must be at least ${values?.min || 3} characters`,
    'validation.event.location.maxLength': `Location must be less than ${values?.max || 200} characters`,
    'validation.event.category.required': 'Category is required',
    'validation.event.imageUrl.invalid': 'Invalid URL',
    'validation.event.imageUrl.protocol': 'Only HTTP and HTTPS URLs are allowed',
    'validation.category.name.minLength': `Name must be at least ${values?.min || 2} characters`,
    'validation.category.name.maxLength': `Name must be less than ${values?.max || 100} characters`,
    'validation.category.description.maxLength': `Description must be less than ${values?.max || 500} characters`,
  };
  return messages[key] || key;
};

export const loginSchema = createLoginSchema(defaultT);
export const registerSchema = createRegisterSchema(defaultT);
export const eventSchema = createEventSchema(defaultT);
export const updateEventSchema = createEventSchema(defaultT);
export const categorySchema = createCategorySchema(defaultT);
export const updateCategorySchema = createCategorySchema(defaultT);

// Type exports
export type RegisterInput = z.infer<ReturnType<typeof createRegisterSchema>>;
export type LoginInput = z.infer<ReturnType<typeof createLoginSchema>>;
export type CreateEventInput = z.infer<ReturnType<typeof createEventSchema>>;
export type UpdateEventInput = CreateEventInput;
export type CategoryInput = z.infer<ReturnType<typeof createCategorySchema>>;
