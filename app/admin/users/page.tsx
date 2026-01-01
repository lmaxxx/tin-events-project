'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useUsers, useUpdateUserRoles, useDeleteUser } from '@/hooks/users/useUsers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TableSkeleton } from '@/components/ui/skeleton';
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

const AVAILABLE_ROLES = ['guest', 'user', 'organizer', 'admin'];

export default function AdminUsersPage() {
  const t = useTranslations('admin.users');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUsers(page, 20);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const users = data?.users || [];
  const pagination = data?.pagination;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">{t('title')}</h2>
          </CardHeader>
          <CardContent>
            <TableSkeleton rows={10} columns={5} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          {t('total', { count: pagination?.total || 0 })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{t('title')}</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">{t('tableHeaders.name')}</th>
                  <th className="text-left py-3 px-4 font-medium">{t('tableHeaders.email')}</th>
                  <th className="text-left py-3 px-4 font-medium">{t('tableHeaders.roles')}</th>
                  <th className="text-left py-3 px-4 font-medium">{t('tableHeaders.created')}</th>
                  <th className="text-right py-3 px-4 font-medium">{t('tableHeaders.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="border-b last:border-0">
                      <td className="py-3 px-4 font-medium">{user.name}</td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                        {user.email}
                      </td>
                      <td className="py-3 px-4">
                        {editingUserId === user.id ? (
                          <EditRolesForm
                            userId={user.id}
                            currentRoles={user.roles}
                            onCancel={() => setEditingUserId(null)}
                            onSuccess={() => setEditingUserId(null)}
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            {user.roles.map((role) => (
                              <Badge key={role} variant="default">
                                {t(`roles.${role}` as any)}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {editingUserId === user.id ? null : (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingUserId(user.id)}
                            >
                              {t('actions.editRoles')}
                            </Button>
                            <DeleteUserButton userId={user.id} />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-neutral-600 dark:text-neutral-400">
                      {t('empty')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 mt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                {t('pagination.previous')}
              </Button>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {t('pagination.page', { current: page, total: pagination.totalPages })}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= pagination.totalPages}
              >
                {t('pagination.next')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EditRolesForm({
  userId,
  currentRoles,
  onCancel,
  onSuccess,
}: {
  userId: string;
  currentRoles: string[];
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const t = useTranslations('admin.users');
  const [selectedRoles, setSelectedRoles] = useState<string[]>(currentRoles);
  const updateRolesMutation = useUpdateUserRoles(userId);

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSave = async () => {
    if (selectedRoles.length === 0) {
      return;
    }
    try {
      await updateRolesMutation.mutateAsync({ roles: selectedRoles });
      onSuccess();
    } catch (error) {
      // Error is handled in the mutation hook
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {AVAILABLE_ROLES.map((role) => (
          <button
            key={role}
            onClick={() => toggleRole(role)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              selectedRoles.includes(role)
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            {t(`roles.${role}` as any)}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={updateRolesMutation.isPending || selectedRoles.length === 0}
        >
          {t('actions.save')}
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          {t('actions.cancel')}
        </Button>
      </div>
    </div>
  );
}

function DeleteUserButton({ userId }: { userId: string }) {
  const t = useTranslations('admin.users');
  const deleteMutation = useDeleteUser();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(userId);
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
