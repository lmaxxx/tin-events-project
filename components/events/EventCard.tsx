'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { useLocale } from '@/hooks/useLocale';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    imageUrl: string | null;
    capacity: number;
    location: string;
    category: {
      name: string;
    };
    visitorCount: number;
  };
}

export function EventCard({ event }: EventCardProps) {
  const t = useTranslations('common');
  const { locale } = useLocale();
  const eventDate = new Date(event.date);
  const isFull = event.visitorCount >= event.capacity;
  const isPastEvent = eventDate < new Date();

  return (
    <Card className="overflow-hidden p-0 pb-4 hover:shadow-lg transition-shadow flex flex-col">
      <div className="aspect-video overflow-hidden bg-neutral-100 dark:bg-neutral-800 relative">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
            <svg
              className="w-16 h-16 text-neutral-300 dark:text-neutral-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>
      <CardHeader className="space-y-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg line-clamp-2">{event.title}</h3>
          <div className="flex flex-col gap-1">
            <Badge variant="default">
              {event.category.name}
            </Badge>
            {isPastEvent && <Badge variant="secondary" className="text-xs">{t('status.eventEnded')}</Badge>}
            {!isPastEvent && isFull && <Badge variant="destructive" className="text-xs">{t('status.full')}</Badge>}
          </div>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 min-h-[2.5rem]">
          {event.description}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{eventDate.toLocaleDateString(locale, {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span>
              {event.visitorCount}/{event.capacity} {t('misc.attendees', { count: event.visitorCount })}
              {!isPastEvent && isFull && <span className="ml-1 text-red-600 dark:text-red-400">({t('status.full')})</span>}
            </span>
          </div>
        </div>
        <Button asChild className="w-full">
          <Link href={`/events/${event.id}`}>{t('actions.viewDetails')}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
