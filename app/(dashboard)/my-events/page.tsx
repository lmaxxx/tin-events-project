'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('events.myEvents');
  const tAuth = useTranslations('auth');
  const tCommon = useTranslations('common');
  const { data: authData } = useAuth();
  const { data: myEventsData, isLoading: myEventsLoading } = useMyEvents();
  const { data: myRegistrationsData, isLoading: myRegistrationsLoading } = useMyRegistrations();

  const user = authData?.user;
  const isOrganizer = user?.roles.includes('organizer') || user?.roles.includes('admin');

  const [activeTab, setActiveTab] = useState<Tab>(isOrganizer ? 'created' : 'registered');

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">{tAuth('authRequired')}</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          {tAuth('pleaseLogin', { action: tAuth('actions.viewEvents') })}
        </p>
        <Button asChild>
          <Link href="/login">{tAuth('goToLogin')}</Link>
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
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        {isOrganizer && (
          <Button asChild>
            <Link href="/events/create">{t('createButton')}</Link>
          </Button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        {isOrganizer && (
          <button
            onClick={() => setActiveTab('created')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'created'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            {t('tabs.created', { count: myEvents.length })}
          </button>
        )}
        <button
          onClick={() => setActiveTab('registered')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'registered'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          {t('tabs.registered', { count: myRegistrations.length })}
        </button>
      </div>

      {/* Created Events Tab */}
      {isOrganizer && activeTab === 'created' && (
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
                  {t('emptyStates.noCreated')}
                </p>
                <Button asChild>
                  <Link href="/events/create">{t('emptyStates.createFirst')}</Link>
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
                  {t('emptyStates.noRegistered')}
                </p>
                <Button asChild>
                  <Link href="/">{t('emptyStates.browseEvents')}</Link>
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
  const tDetail = useTranslations('events.detail');
  const tCommon = useTranslations('common');
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
            <Link href={`/events/${event.id}`}>{tCommon('actions.viewDetails')}</Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                {tDetail('unregister')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{tDetail('unregisterDialog.title')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {tDetail('unregisterDialog.description')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{tDetail('unregisterDialog.cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => unregisterMutation.mutate()}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {tDetail('unregisterDialog.confirm')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
