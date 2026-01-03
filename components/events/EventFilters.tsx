'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchInput } from '@/components/ui/search-input';
import { DateFilterPicker } from '@/components/ui/date-filter-picker';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/categories/useCategories';
import { useTranslations } from 'next-intl';

interface EventFiltersProps {
  selectedCategory?: string;
  onCategoryChange: (categoryId: string | undefined) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  dateFilter: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export function EventFilters({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  dateFilter,
  onDateChange,
}: EventFiltersProps) {
  const { data: categories, isLoading } = useCategories();
  const t = useTranslations('events.filters');

  const hasActiveFilters = selectedCategory || searchQuery || dateFilter;

  const handleClearAll = () => {
    onCategoryChange(undefined);
    onSearchChange('');
    onDateChange(undefined);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="h-10 w-full md:w-[300px] animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="h-10 w-full md:w-[200px] animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="h-10 w-full md:w-[240px] animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 flex-wrap">
      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder={t('search.placeholder')}
      />

      <Select
        value={selectedCategory || 'all'}
        onValueChange={(value) => onCategoryChange(value === 'all' ? undefined : value)}
      >
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder={t('allCategories')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('allCategories')}</SelectItem>
          {categories?.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DateFilterPicker
        value={dateFilter}
        onChange={onDateChange}
        placeholder={t('date.placeholder')}
      />

      {hasActiveFilters && (
        <Button variant="ghost" onClick={handleClearAll} className="w-full md:w-auto">
          {t('clearAll')}
        </Button>
      )}
    </div>
  );
}
