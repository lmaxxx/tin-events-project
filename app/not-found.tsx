import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-neutral-900 dark:text-neutral-100">404</h1>
          <div className="mt-4">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Page Not Found
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Sorry, we couldn't find the page you're looking for. It might have been removed,
              renamed, or doesn't exist.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/">Back to Home</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/events/create">Create Event</Link>
          </Button>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-neutral-500 dark:text-neutral-500">
            Lost? Try navigating from the{' '}
            <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
              homepage
            </Link>
            {' '}or{' '}
            <Link href="/my-events" className="text-blue-600 dark:text-blue-400 hover:underline">
              your events
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
