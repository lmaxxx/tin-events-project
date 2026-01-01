'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/categories/useCategories';
import { categorySchema, type CategoryInput } from '@/lib/validation/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export default function AdminCategoriesPage() {
  const t = useTranslations('admin.categories');
  const { data: categories, isLoading } = useCategories();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <div className="h-96 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? t('actions.cancel') : t('actions.addCategory')}
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">{t('createNew')}</h2>
          </CardHeader>
          <CardContent>
            <CategoryForm onSuccess={() => setShowAddForm(false)} />
          </CardContent>
        </Card>
      )}

      {editingCategory && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{t('editCategory')}</h2>
              <Button variant="ghost" size="sm" onClick={() => setEditingCategory(null)}>
                {t('actions.cancel')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CategoryForm
              category={editingCategory}
              onSuccess={() => setEditingCategory(null)}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{t('allCategories')}</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">{t('tableHeaders.name')}</th>
                  <th className="text-left py-3 px-4 font-medium">{t('tableHeaders.description')}</th>
                  <th className="text-left py-3 px-4 font-medium">{t('tableHeaders.created')}</th>
                  <th className="text-right py-3 px-4 font-medium">{t('tableHeaders.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <tr key={category.id} className="border-b last:border-0">
                      <td className="py-3 px-4 font-medium">{category.name}</td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                        {category.description || t('emptyDescription')}
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-400">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingCategory(category)}
                          >
                            {t('actions.edit')}
                          </Button>
                          <DeleteCategoryButton categoryId={category.id} />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-neutral-600 dark:text-neutral-400">
                      {t('empty')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CategoryForm({
  category,
  onSuccess,
}: {
  category?: Category;
  onSuccess: () => void;
}) {
  const t = useTranslations('admin.categories');
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory(category?.id || '');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
    },
  });

  const onSubmit = async (data: CategoryInput) => {
    try {
      if (category) {
        await updateMutation.mutateAsync(data);
      } else {
        await createMutation.mutateAsync(data);
      }
      onSuccess();
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field>
        <FieldLabel htmlFor="name">{t('form.name')}</FieldLabel>
        <Input
          id="name"
          placeholder={t('form.namePlaceholder')}
          {...register('name')}
          aria-invalid={!!errors.name}
        />
        <FieldError errors={[errors.name]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="description">{t('form.description')}</FieldLabel>
        <Textarea
          id="description"
          placeholder={t('form.descriptionPlaceholder')}
          rows={3}
          {...register('description')}
          aria-invalid={!!errors.description}
        />
        <FieldError errors={[errors.description]} />
      </Field>

      <Button type="submit" disabled={isLoading}>
        {category ? t('form.submitUpdate') : t('form.submitCreate')}
      </Button>
    </form>
  );
}

function DeleteCategoryButton({ categoryId }: { categoryId: string }) {
  const t = useTranslations('admin.categories');
  const deleteMutation = useDeleteCategory();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(categoryId);
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          {t('actions.delete')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('deleteDialog.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('deleteDialog.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('deleteDialog.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={deleteMutation.isPending}
          >
            {t('deleteDialog.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
