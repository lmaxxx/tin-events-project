'use client';

import { use } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/auth/useAuth';
import { useEvent, useRegisterForEvent, useUnregisterFromEvent, useDeleteEvent } from '@/hooks/events/useEvents';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations('events.detail');
  const tCommon = useTranslations('common');
  const { data: authData } = useAuth();
  const { data: eventData, isLoading } = useEvent(id);
  const registerMutation = useRegisterForEvent(id);
  const unregisterMutation = useUnregisterFromEvent(id);
  const deleteMutation = useDeleteEvent();

  const user = authData?.user;
  const event = eventData?.event;

  const isRegistered = event?.visitors?.some((v) => v.id === user?.id);
  const isCreator = event?.creator.id === user?.id;
  const isAdmin = user?.roles.includes('admin');
  const canManage = isCreator || isAdmin;
  const isFull = event && event.visitorCount >= event.capacity;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="h-96 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">{t('notFound')}</h1>
        <Button asChild>
          <Link href="/">{tCommon('actions.backToEvents')}</Link>
        </Button>
      </div>
    );
  }

  const eventDate = new Date(event.date);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/">{t('backToEvents')}</Link>
      </Button>

      <Card className={"p-0 pb-4"}>
        {event.imageUrl && (
          <div className="aspect-2/1 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{event.title}</h1>
              <div className="flex items-center gap-2">
                <Badge>{event.category.name}</Badge>
                {isFull && <Badge variant="destructive">{tCommon('status.full')}</Badge>}
              </div>
            </div>
            {canManage && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/events/${id}/edit`}>{t('edit')}</Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      {t('delete')}
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
                        onClick={() => deleteMutation.mutate(id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {t('deleteDialog.confirm')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            <p>{event.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm font-medium">{tCommon('fields.dateTime')}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {eventDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {eventDate.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium">{tCommon('fields.location')}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{event.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <p className="text-sm font-medium">{tCommon('fields.organizer')}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{event.creator.name}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-2">{tCommon('fields.capacity')}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-neutral-200 dark:bg-neutral-800 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(event.visitorCount / event.capacity) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    {event.visitorCount}/{event.capacity}
                  </span>
                </div>
              </div>

              {user ? (
                <div className="pt-4">
                  {isRegistered ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => unregisterMutation.mutate()}
                      disabled={unregisterMutation.isPending}
                    >
                      {unregisterMutation.isPending ? t('unregistering') : t('unregister')}
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => registerMutation.mutate()}
                      disabled={registerMutation.isPending || isFull}
                    >
                      {registerMutation.isPending ? t('registering') : isFull ? t('eventFull') : t('register')}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="pt-4">
                  <Button className="w-full" asChild>
                    <Link href="/login">{t('loginToRegister')}</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
