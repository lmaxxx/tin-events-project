'use client';

import { useAuth } from '@/hooks/auth/useAuth';
import { useCreateEvent } from '@/hooks/events/useEvents';
import { EventForm } from '@/components/forms/EventForm';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { CreateEventInput } from '@/lib/validation/schemas';

export default function CreateEventPage() {
  const { data: authData } = useAuth();
  const createMutation = useCreateEvent();

  const user = authData?.user;
  const isOrganizer = user?.roles.includes('organizer');
  const isAdmin = user?.roles.includes('admin');
  const canCreate = isOrganizer || isAdmin;

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Please log in to create events.
        </p>
        <Button asChild>
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    );
  }

  if (!canCreate) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-2">Insufficient Permissions</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          You need organizer or admin privileges to create events.
        </p>
        <Button asChild>
          <Link href="/">Back to Events</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = async (data: CreateEventInput) => {
    try {
      await createMutation.mutateAsync(data);
      // Success toast and redirect are handled in the mutation's onSuccess callback
    } catch (error) {
      // Error toast is handled in the mutation's onError callback
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href="/">← Back</Link>
        </Button>
        <h1 className="text-3xl font-bold">Create New Event</h1>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Event Details</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Fill in the information below to create a new event.
          </p>
        </CardHeader>
        <CardContent>
          <EventForm
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
            submitText="Create Event"
          />
        </CardContent>
      </Card>
    </div>
  );
}
