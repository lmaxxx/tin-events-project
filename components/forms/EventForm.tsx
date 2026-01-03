'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema, type CreateEventInput } from '@/lib/validation/schemas';
import { useCategories } from '@/hooks/categories/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { useTranslations } from 'next-intl';

interface EventFormProps {
  defaultValues?: Partial<CreateEventInput>;
  onSubmit: (data: CreateEventInput) => void;
  isLoading?: boolean;
  submitText?: string;
}

export function EventForm({ defaultValues, onSubmit, isLoading, submitText = 'Create Event' }: EventFormProps) {
  const t = useTranslations('events.form');
  const tCommon = useTranslations('common');
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Field>
        <FieldLabel htmlFor="title">{t('title')}</FieldLabel>
        <Input
          id="title"
          placeholder={t('titlePlaceholder')}
          {...register('title')}
          aria-invalid={!!errors.title}
        />
        <FieldError errors={[errors.title]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="description">{t('description')}</FieldLabel>
        <Textarea
          id="description"
          placeholder={t('descriptionPlaceholder')}
          rows={6}
          {...register('description')}
          aria-invalid={!!errors.description}
        />
        <FieldError errors={[errors.description]} />
      </Field>

      <div className="grid md:grid-cols-2 gap-6">
        <Field>
          <FieldLabel htmlFor="date">{tCommon('fields.dateTime')}</FieldLabel>
          <DateTimePicker
            value={date}
            onChange={(value) => setValue('date', value, { shouldValidate: true })}
            minDate={new Date()}
            error={errors.date?.message}
          />
          <FieldError errors={[errors.date]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="capacity">{tCommon('fields.capacity')}</FieldLabel>
          <Input
            id="capacity"
            type="number"
            placeholder={t('capacityPlaceholder')}
            {...register('capacity', { valueAsNumber: true })}
            aria-invalid={!!errors.capacity}
          />
          <FieldError errors={[errors.capacity]} />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="location">{tCommon('fields.location')}</FieldLabel>
        <Input
          id="location"
          placeholder={t('locationPlaceholder')}
          {...register('location')}
          aria-invalid={!!errors.location}
        />
        <FieldError errors={[errors.location]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="imageUrl">{t('imageUrl')}</FieldLabel>
        <Input
          id="imageUrl"
          type="url"
          placeholder={t('imageUrlPlaceholder')}
          {...register('imageUrl')}
          aria-invalid={!!errors.imageUrl}
        />
        <FieldError errors={[errors.imageUrl]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="category">{tCommon('fields.category')}</FieldLabel>
        <Select
          value={selectedCategory}
          onValueChange={(value) => setValue('categoryId', value, { shouldValidate: true })}
          disabled={categoriesLoading}
        >
          <SelectTrigger id="category" aria-invalid={!!errors.categoryId}>
            <SelectValue placeholder={t('categoryPlaceholder')} />
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
          {isLoading ? tCommon('actions.saving') : submitText}
        </Button>
      </div>
    </form>
  );
}
