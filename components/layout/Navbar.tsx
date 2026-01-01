'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth, useLogout } from '@/hooks/auth/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useTranslations } from 'next-intl';
import { LanguageSelector } from '@/components/layout/LanguageSelector';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const { data: authData, isLoading } = useAuth();
  const logout = useLogout();
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations('common');
  const tAuth = useTranslations('auth');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = authData?.user;
  const isOrganizer = user?.roles.includes('organizer') || user?.roles.includes('admin');
  const isAdmin = user?.roles.includes('admin');

  return (
    <nav className="border-b bg-white dark:bg-neutral-950">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            {t('nav.brand')}
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              {t('nav.events')}
            </Link>
            {isOrganizer && (
              <Link
                href="/events/create"
                className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              >
                {t('nav.createEvent')}
              </Link>
            )}
            {user && (
              <Link
                href="/my-events"
                className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              >
                {t('nav.myEvents')}
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              >
                {t('nav.admin')}
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Theme Toggle */}
          <Button variant="ghost" size="sm" onClick={toggleTheme} className="hidden sm:flex">
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </Button>

          {/* Desktop User Menu */}
          {isLoading ? (
            <div className="h-8 w-8 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-full" />
          ) : user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      {user.email}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                      {user.roles.join(', ')}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/my-events">{t('nav.myEvents')}</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard">{t('nav.adminDashboard')}</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logout.mutate()}
                    disabled={logout.isPending}
                  >
                    {logout.isPending ? tAuth('loggingOut') : tAuth('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="sm:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                  />
                </svg>
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                <Link href="/login">{t('nav.login')}</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">{t('nav.register')}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && user && (
        <div className="sm:hidden border-t bg-white dark:bg-neutral-950">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link
              href="/"
              className="block py-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.events')}
            </Link>
            {isOrganizer && (
              <Link
                href="/events/create"
                className="block py-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.createEvent')}
              </Link>
            )}
            <Link
              href="/my-events"
              className="block py-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.myEvents')}
            </Link>
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="block py-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.admin')}
              </Link>
            )}
            <div className="pt-2 border-t">
              <button
                onClick={toggleTheme}
                className="w-full text-left py-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              >
                {theme === 'dark' ? t('theme.light') : t('theme.dark')}
              </button>
              <button
                onClick={() => {
                  logout.mutate();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              >
                {tAuth('logout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
