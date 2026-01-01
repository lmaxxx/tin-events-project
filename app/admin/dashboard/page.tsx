'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useUsers } from '@/hooks/users/useUsers';
import { useEvents } from '@/hooks/events/useEvents';
import { useCategories } from '@/hooks/categories/useCategories';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatsCardSkeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
  const t = useTranslations('admin.dashboard');
  const { data: usersData, isLoading: usersLoading } = useUsers(1, 1);
  const { data: eventsData, isLoading: eventsLoading } = useEvents();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const totalUsers = usersData?.pagination?.total || 0;
  const totalEvents = Array.isArray(eventsData) ? eventsData.length : 0;
  const totalCategories = categories?.length || 0;

  const isLoading = usersLoading || eventsLoading || categoriesLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          {t('description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title={t('stats.totalUsers')}
          value={totalUsers}
          description={t('stats.registeredUsers')}
          href="/admin/users"
          linkText={t('stats.manageUsers')}
        />
        <StatsCard
          title={t('stats.totalEvents')}
          value={totalEvents}
          description={t('stats.createdEvents')}
          href="/admin/events"
          linkText={t('stats.manageEvents')}
        />
        <StatsCard
          title={t('stats.categories')}
          value={totalCategories}
          description={t('stats.eventCategories')}
          href="/admin/categories"
          linkText={t('stats.manageCategories')}
        />
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{t('quickActions.title')}</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickActionCard
              title={t('quickActions.userManagement')}
              description={t('quickActions.userManagementDesc')}
              href="/admin/users"
            />
            <QuickActionCard
              title={t('quickActions.eventModeration')}
              description={t('quickActions.eventModerationDesc')}
              href="/admin/events"
            />
            <QuickActionCard
              title={t('quickActions.categoryManagement')}
              description={t('quickActions.categoryManagementDesc')}
              href="/admin/categories"
            />
            <QuickActionCard
              title={t('quickActions.backToSite')}
              description={t('quickActions.backToSiteDesc')}
              href="/"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({
  title,
  value,
  description,
  href,
  linkText,
}: {
  title: string;
  value: number;
  description: string;
  href: string;
  linkText: string;
}) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{title}</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-4xl font-bold">{value.toLocaleString()}</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{description}</p>
        </div>
        <Button variant="outline" size="sm" asChild className="w-full">
          <Link href={href}>{linkText}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function QuickActionCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
