'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRemoveParticipant, useAddParticipant } from '@/hooks/events/useEventParticipants';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchAvailableUsers } from '@/hooks/users/useSearchUsers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Participant {
  id: string;
  name: string;
  email: string;
}

interface ParticipantListProps {
  eventId: string;
  participants: Participant[];
  canManage?: boolean;
}

export function ParticipantList({
  eventId,
  participants,
  canManage = false
}: ParticipantListProps) {
  const t = useTranslations('events.detail.participants');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {t('title')} ({participants.length})
        </h3>
        {canManage && <AddParticipantDialog eventId={eventId} existingParticipants={participants} />}
      </div>

      <div className="space-y-2">
        {participants.length === 0 ? (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 py-4 text-center">
            {t('noParticipants')}
          </p>
        ) : (
          participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card"
            >
              <div>
                <p className="font-medium">{participant.name}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {participant.email}
                </p>
              </div>
              {canManage && (
                <RemoveParticipantButton
                  eventId={eventId}
                  userId={participant.id}
                  userName={participant.name}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function RemoveParticipantButton({
  eventId,
  userId,
  userName
}: {
  eventId: string;
  userId: string;
  userName: string;
}) {
  const t = useTranslations('events.detail.participants');
  const removeMutation = useRemoveParticipant(eventId);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          {t('remove')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('removeDialog.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('removeDialog.description', { name: userName })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('removeDialog.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => removeMutation.mutate(userId)}
            className="bg-red-600 hover:bg-red-700"
            disabled={removeMutation.isPending}
          >
            {t('removeDialog.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AddParticipantDialog({
  eventId,
  existingParticipants
}: {
  eventId: string;
  existingParticipants: Participant[];
}) {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const t = useTranslations('events.detail.participants');

  // Debounce search input (500ms delay)
  const debouncedSearch = useDebounce(searchInput, 500);

  // Fetch available users based on search query
  const { data: users = [], isLoading } = useSearchAvailableUsers(
    eventId,
    debouncedSearch,
    { enabled: open } // Only fetch when dialog is open
  );

  const addMutation = useAddParticipant(eventId);

  const handleAdd = () => {
    if (selectedUserId) {
      addMutation.mutate(selectedUserId, {
        onSuccess: () => {
          setOpen(false);
          setSelectedUserId('');
          setSearchInput('');
        },
      });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset state when closing
      setSearchInput('');
      setSelectedUserId('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          {t('addParticipant')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('addDialog.title')}</DialogTitle>
          <DialogDescription>{t('addDialog.description')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Search Input */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t('addDialog.searchLabel')}
            </label>
            <Input
              type="text"
              placeholder={t('addDialog.searchPlaceholder')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full"
            />
          </div>

          {/* User List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-4 text-sm text-neutral-600">
                {t('addDialog.loading')}
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-4 text-sm text-neutral-600">
                {searchInput.trim()
                  ? t('addDialog.noResults')
                  : t('addDialog.noUsersAvailable')
                }
              </div>
            ) : (
              users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => setSelectedUserId(user.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-colors",
                    selectedUserId === user.id
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                      : "border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  )}
                >
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {user.email}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t pt-4">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            {t('addDialog.cancel')}
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!selectedUserId || addMutation.isPending}
          >
            {addMutation.isPending ? t('addDialog.adding') : t('addDialog.confirm')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
