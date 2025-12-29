'use client';

import { useState } from 'react';
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
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUsers(page, 20);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const users = data?.users || [];
  const pagination = data?.pagination;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Users</h1>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">All Users</h2>
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
        <h1 className="text-3xl font-bold">Users</h1>
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          Total: {pagination?.total || 0} users
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">All Users</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Email</th>
                  <th className="text-left py-3 px-4 font-medium">Roles</th>
                  <th className="text-left py-3 px-4 font-medium">Created</th>
                  <th className="text-right py-3 px-4 font-medium">Actions</th>
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
                                {role}
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
                              Edit Roles
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
                      No users found.
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
                Previous
              </Button>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Page {page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= pagination.totalPages}
              >
                Next
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
            {role}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={updateRolesMutation.isPending || selectedRoles.length === 0}
        >
          {updateRolesMutation.isPending ? 'Saving...' : 'Save'}
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

function DeleteUserButton({ userId }: { userId: string }) {
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
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user account
            and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
