'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/auth/useAuth';
import { useMyEvents, useMyRegistrations, useUnregisterFromEvent } from '@/hooks/events/useEvents';
import { EventCard } from '@/components/events/EventCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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

type Tab = 'created' | 'registered';

export default function MyEventsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('created');
  const { data: authData } = useAuth();
  const { data: myEventsData, isLoading: myEventsLoading } = useMyEvents();
  const { data: myRegistrationsData, isLoading: myRegistrationsLoading } = useMyRegistrations();

  const user = authData?.user;

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Please log in to view your events.
        </p>
        <Button asChild>
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    );
  }

  const myEvents = myEventsData?.events || [];
  const myRegistrations = myRegistrationsData?.events || [];
  const isLoading = activeTab === 'created' ? myEventsLoading : myRegistrationsLoading;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Events</h1>
        <Button asChild>
          <Link href="/events/create">Create Event</Link>
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('created')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'created'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          Created Events ({myEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('registered')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'registered'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          Registered Events ({myRegistrations.length})
        </button>
      </div>

      {/* Created Events Tab */}
      {activeTab === 'created' && (
        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-96 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-lg"
                />
              ))}
            </div>
          ) : myEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  You haven't created any events yet.
                </p>
                <Button asChild>
                  <Link href="/events/create">Create Your First Event</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Registered Events Tab */}
      {activeTab === 'registered' && (
        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-96 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-lg"
                />
              ))}
            </div>
          ) : myRegistrations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myRegistrations.map((event) => (
                <RegisteredEventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  You haven't registered for any events yet.
                </p>
                <Button asChild>
                  <Link href="/">Browse Events</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function RegisteredEventCard({ event }: { event: any }) {
  const unregisterMutation = useUnregisterFromEvent(event.id);

  const eventDate = new Date(event.date);
  const isFull = event.visitorCount >= event.capacity;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {event.imageUrl && (
        <div className="aspect-video overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg line-clamp-2">{event.title}</h3>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
          {event.description}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              {eventDate.toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href={`/events/${event.id}`}>View Details</Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                Unregister
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Unregister from Event?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to unregister from this event? You can register again later if spots are available.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => unregisterMutation.mutate()}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Unregister
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
