'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { format } from 'date-fns';
import type { Locale } from 'date-fns';
import { enUS, uk } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar03Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
  value: string | Date;
  onChange: (date: string) => void;
  minDate?: Date;
  error?: string;
}

// Map next-intl locales to date-fns locales
const getDateFnsLocale = (locale: string) => {
  const localeMap: Record<string, Locale> = {
    en: enUS,
    uk: uk,
  };
  return localeMap[locale] || enUS;
};

export function DateTimePicker({ value, onChange, minDate, error }: DateTimePickerProps) {
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  // Initialize date, hours, and minutes from value
  const initialDate = value ? new Date(value) : undefined;
  const [date, setDate] = useState<Date | undefined>(initialDate);
  const [hours, setHours] = useState(initialDate ? initialDate.getHours().toString().padStart(2, '0') : '12');
  const [minutes, setMinutes] = useState(initialDate ? initialDate.getMinutes().toString().padStart(2, '0') : '00');

  // Update local state when value prop changes
  useEffect(() => {
    if (value) {
      const newDate = new Date(value);
      setDate(newDate);
      setHours(newDate.getHours().toString().padStart(2, '0'));
      setMinutes(newDate.getMinutes().toString().padStart(2, '0'));
    }
  }, [value]);

  // Combine date + time and call onChange
  useEffect(() => {
    if (date) {
      const combined = new Date(date);
      combined.setHours(parseInt(hours), parseInt(minutes));
      onChange(combined.toISOString());
    }
  }, [date, hours, minutes, onChange]);

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      setOpen(false);
    }
  };

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground',
              error && 'border-red-500 focus:ring-red-500'
            )}
          >
            <HugeiconsIcon icon={Calendar03Icon} className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP', { locale: getDateFnsLocale(locale) }) : 'Select date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={(date) => minDate ? date < minDate : false}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {date && (
        <div className="flex items-center gap-2">
          <Select value={hours} onValueChange={setHours}>
            <SelectTrigger className={cn('w-[100px]', error && 'border-red-500 focus:ring-red-500')}>
              <SelectValue placeholder="HH" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }, (_, i) => {
                const hour = i.toString().padStart(2, '0');
                return (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <span className="text-lg font-medium">:</span>
          <Select value={minutes} onValueChange={setMinutes}>
            <SelectTrigger className={cn('w-[100px]', error && 'border-red-500 focus:ring-red-500')}>
              <SelectValue placeholder="MM" />
            </SelectTrigger>
            <SelectContent>
              {['00', '15', '30', '45'].map((minute) => (
                <SelectItem key={minute} value={minute}>
                  {minute}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
