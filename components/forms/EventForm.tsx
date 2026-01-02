'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema, type CreateEventInput } from '@/lib/validation/schemas';
import { useCategories } from '@/hooks/categories/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

interface EventFormProps {
  defaultValues?: Partial<CreateEventInput>;
  onSubmit: (data: CreateEventInput) => void;
  isLoading?: boolean;
  submitText?: string;
}

export function EventForm({ defaultValues, onSubmit, isLoading, submitText = 'Create Event' }: EventFormProps) {
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateEventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      date: defaultValues?.date || '',
      imageUrl: defaultValues?.imageUrl || '',
      capacity: defaultValues?.capacity || 0,
      location: defaultValues?.location || '',
      categoryId: defaultValues?.categoryId || '',
    },
  });

  const selectedCategory = watch('categoryId');
  const date = watch('date');

  console.log(date)
  console.log(typeof date)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Field>
        <FieldLabel htmlFor="title">Event Title</FieldLabel>
        <Input
          id="title"
          placeholder="Enter event title"
          {...register('title')}
          aria-invalid={!!errors.title}
        />
        <FieldError errors={[errors.title]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <Textarea
          id="description"
          placeholder="Describe your event"
          rows={6}
          {...register('description')}
          aria-invalid={!!errors.description}
        />
        <FieldError errors={[errors.description]} />
      </Field>

      <div className="grid md:grid-cols-2 gap-6">
        <Field>
          <FieldLabel htmlFor="date">Date & Time</FieldLabel>
          <Input
            id="date"
            type="datetime-local"
            {...register('date')}
            aria-invalid={!!errors.date}
          />
          <FieldError errors={[errors.date]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="capacity">Capacity</FieldLabel>
          <Input
            id="capacity"
            type="number"
            placeholder="Maximum attendees"
            {...register('capacity', { valueAsNumber: true })}
            aria-invalid={!!errors.capacity}
          />
          <FieldError errors={[errors.capacity]} />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="location">Location</FieldLabel>
        <Input
          id="location"
          placeholder="Event location or address"
          {...register('location')}
          aria-invalid={!!errors.location}
        />
        <FieldError errors={[errors.location]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="imageUrl">Image URL (optional)</FieldLabel>
        <Input
          id="imageUrl"
          type="url"
          placeholder="https://example.com/image.jpg"
          {...register('imageUrl')}
          aria-invalid={!!errors.imageUrl}
        />
        <FieldError errors={[errors.imageUrl]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="category">Category</FieldLabel>
        <Select
          value={selectedCategory}
          onValueChange={(value) => setValue('categoryId', value, { shouldValidate: true })}
          disabled={categoriesLoading}
        >
          <SelectTrigger id="category" aria-invalid={!!errors.categoryId}>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError errors={[errors.categoryId]} />
      </Field>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading || categoriesLoading} className="flex-1">
          {isLoading ? 'Saving...' : submitText}
        </Button>
      </div>
    </form>
  );
}
