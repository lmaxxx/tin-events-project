'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useEvents, useDeleteEvent } from '@/hooks/events/useEvents';
import { useCategories } from '@/hooks/categories/useCategories';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const pageSize = 20;

  const { data: eventsData, isLoading } = useEvents({
    page,
    pageSize,
    categoryId: selectedCategory,
  });
  const { data: categories } = useCategories();

  const events = eventsData?.data || [];
  const pagination = eventsData?.pagination;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Events</h1>
        <div className="h-96 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Events</h1>
        <div className="flex items-center gap-4">
          <Select
            value={selectedCategory || 'all'}
            onValueChange={(value) => {
              setSelectedCategory(value === 'all' ? undefined : value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">All Events</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Title</th>
                  <th className="text-left py-3 px-4 font-medium">Category</th>
                  <th className="text-left py-3 px-4 font-medium">Creator</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Attendees</th>
                  <th className="text-right py-3 px-4 font-medium">Actions</th>
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
                          {event.creator?.name || 'Unknown'}
                        </td>
                        <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-400">
                          {eventDate.toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={isFull ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                            {event.visitorCount}/{event.capacity}
                            {isFull && ' (Full)'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/events/${event.id}`}>View</Link>
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
                      No events found.
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

function DeleteEventButton({ eventId }: { eventId: string }) {
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
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Event?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the event
            and all registrations.
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
