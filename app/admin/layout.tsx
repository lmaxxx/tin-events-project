'use client';

import { useAuth } from '@/hooks/auth/useAuth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: authData, isLoading } = useAuth();
  const pathname = usePathname();

  const user = authData?.user;
  const isAdmin = user?.roles.includes('admin');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <div className="container mx-auto px-4 py-8">
          <div className="h-96 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            You need administrator privileges to access this area.
          </p>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/events', label: 'Events' },
    { href: '/admin/categories', label: 'Categories' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="border-b bg-white dark:bg-neutral-950">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xl font-bold">
                Admin Panel
              </Link>
              <nav className="hidden md:flex items-center gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm transition-colors ${
                      pathname === item.href
                        ? 'text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">← Back to Site</Link>
            </Button>
          </div>
        </div>
      </div>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
