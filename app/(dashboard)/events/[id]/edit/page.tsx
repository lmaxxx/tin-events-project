'use client';

import { use } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/auth/useAuth';
import { useEvent, useUpdateEvent } from '@/hooks/events/useEvents';
import { EventForm } from '@/components/forms/EventForm';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { CreateEventInput } from '@/lib/validation/schemas';

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: authData } = useAuth();
  const { data: eventData, isLoading } = useEvent(id);
  const updateMutation = useUpdateEvent(id);

  const user = authData?.user;
  const event = eventData?.event;

  const isCreator = event?.creator.id === user?.id;
  const isAdmin = user?.roles.includes('admin');
  const canManage = isCreator || isAdmin;

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="h-96 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-2">Event not found</h1>
        <Button asChild>
          <Link href="/">Back to Events</Link>
        </Button>
      </div>
    );
  }

  if (!canManage) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-2">Insufficient Permissions</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          You can only edit events you created.
        </p>
        <Button asChild>
          <Link href={`/events/${id}`}>Back to Event</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = async (data: CreateEventInput) => {
    try {
      await updateMutation.mutateAsync(data);
      // Success toast and redirect are handled in the mutation's onSuccess callback
    } catch (error) {
      // Error toast is handled in the mutation's onError callback
    }
  };

  // Convert event date to datetime-local format
  const eventDate = new Date(event.date);
  const localDatetime = new Date(eventDate.getTime() - eventDate.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href={`/events/${id}`}>← Back</Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Event</h1>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Event Details</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Update the information below to modify your event.
          </p>
        </CardHeader>
        <CardContent>
          <EventForm
            defaultValues={{
              title: event.title,
              description: event.description,
              date: localDatetime,
              imageUrl: event.imageUrl || '',
              capacity: event.capacity,
              location: event.location,
              categoryId: event.category.id,
            }}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
            submitText="Update Event"
          />
        </CardContent>
      </Card>
    </div>
  );
}
