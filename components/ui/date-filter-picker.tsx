'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { format } from 'date-fns';
import type { Locale } from 'date-fns';
import { enUS, uk } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar03Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

interface DateFilterPickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
}

// Map next-intl locales to date-fns locales
const getDateFnsLocale = (locale: string) => {
  const localeMap: Record<string, Locale> = {
    en: enUS,
    uk: uk,
  };
  return localeMap[locale] || enUS;
};

export function DateFilterPicker({ value, onChange, placeholder = 'Select date' }: DateFilterPickerProps) {
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    onChange(date);
    if (date) {
      setOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'justify-start text-left font-normal min-w-[240px]',
            !value && 'text-muted-foreground'
          )}
        >
          <HugeiconsIcon icon={Calendar03Icon} className="mr-2 h-4 w-4" />
          {value ? format(value, 'PPP', { locale: getDateFnsLocale(locale) }) : placeholder}
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="ml-auto h-6 w-6 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              onClick={handleClear}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={14} />
              <span className="sr-only">Clear date</span>
            </Button>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
