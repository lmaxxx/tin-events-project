'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEvents, useDeleteEvent } from '@/hooks/events/useEvents';
import { useDebounce } from '@/hooks/useDebounce';
import { EventFilters } from '@/components/events/EventFilters';
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

export default function AdminEventsPage() {
  const t = useTranslations('admin.events');
  const tCommon = useTranslations('common');
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const pageSize = 20;

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: eventsData, isLoading } = useEvents({
    page,
    pageSize,
    categoryId: selectedCategory,
    search: debouncedSearch,
    date: dateFilter,
  });

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, dateFilter, selectedCategory]);

  const events = eventsData?.data || [];
  const pagination = eventsData?.pagination;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">{t('allEvents')}</h2>
          </CardHeader>
          <CardContent>
            <TableSkeleton rows={10} columns={6} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('title')}</h1>

      <EventFilters
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
      />

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{t('allEvents')}</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">{t('tableHeaders.title')}</th>
                  <th className="text-left py-3 px-4 font-medium">{t('tableHeaders.category')}</th>
                  <th className="text-left py-3 px-4 font-medium">{t('tableHeaders.creator')}</th>
                  <th className="text-left py-3 px-4 font-medium">{t('tableHeaders.date')}</th>
                  <th className="text-left py-3 px-4 font-medium">{t('tableHeaders.attendees')}</th>
                  <th className="text-right py-3 px-4 font-medium">{t('tableHeaders.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {events.length > 0 ? (
                  events.map((event) => {
                    const eventDate = new Date(event.date);
                    const isFull = event.visitorCount >= event.capacity;

                    return (
                      <tr key={event.id} className="border-b last:border-0">
                        <td className="py-3 px-4 font-medium">{event.title}</td>
                        <td className="py-3 px-4">
                          <Badge>{event.category.name}</Badge>
                        </td>
                        <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                          {event.creator?.name || tCommon('misc.unknown')}
                        </td>
                        <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-400">
                          {eventDate.toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={isFull ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                            {event.visitorCount}/{event.capacity}
                            {isFull && ` (${tCommon('status.full')})`}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/events/${event.id}`}>{t('actions.view')}</Link>
                            </Button>
                            <DeleteEventButton eventId={event.id} />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-neutral-600 dark:text-neutral-400">
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

function DeleteEventButton({ eventId }: { eventId: string }) {
  const t = useTranslations('admin.events');
  const deleteMutation = useDeleteEvent();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(eventId);
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
