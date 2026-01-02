'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useEvents } from '@/hooks/events/useEvents';
import { useDebounce } from '@/hooks/useDebounce';
import { EventCard } from '@/components/events/EventCard';
import { EventFilters } from '@/components/events/EventFilters';
import { Button } from '@/components/ui/button';
import { EventCardSkeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const t = useTranslations('events.list');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data, isLoading, error } = useEvents({
    page,
    pageSize,
    categoryId: selectedCategory,
    search: debouncedSearch,
    date: dateFilter,
  });

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{t('failedToLoad')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            {t('description')}
          </p>
        </div>
      </div>

      <EventFilters
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : data && data?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {/*{data.pagination && data.pagination.totalPages > 1 && (*/}
          {/*  <div className="flex items-center justify-center gap-2 pt-4">*/}
          {/*    <Button*/}
          {/*      variant="outline"*/}
          {/*      onClick={() => setPage((p) => Math.max(1, p - 1))}*/}
          {/*      disabled={page === 1}*/}
          {/*    >*/}
          {/*      Previous*/}
          {/*    </Button>*/}
          {/*    <span className="text-sm text-neutral-600 dark:text-neutral-400">*/}
          {/*      Page {page} of {data.pagination.totalPages}*/}
          {/*    </span>*/}
          {/*    <Button*/}
          {/*      variant="outline"*/}
          {/*      onClick={() => setPage((p) => p + 1)}*/}
          {/*      disabled={page >= data.pagination.totalPages}*/}
          {/*    >*/}
          {/*      Next*/}
          {/*    </Button>*/}
          {/*  </div>*/}
          {/*)}*/}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-neutral-600 dark:text-neutral-400">
            {t('noEvents')}
          </p>
        </div>
      )}
    </div>
  );
}
