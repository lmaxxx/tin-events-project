'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { createLoginSchema, type LoginInput } from '@/lib/validation/schemas';
import { useLogin } from '@/hooks/auth/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function LoginPage() {
  const t = useTranslations();
  const tAuth = useTranslations('auth.login');
  const tFields = useTranslations('auth.fields');
  const tCommon = useTranslations('common');
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(createLoginSchema(t)),
  });

  const onSubmit = (data: LoginInput) => {
    login.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold">{tAuth('title')}</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {tAuth('description')}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{tFields('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={tFields('emailPlaceholder')}
                {...register('email')}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{tFields('password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={tFields('passwordPlaceholder')}
                {...register('password')}
                aria-invalid={errors.password ? 'true' : 'false'}
              />
              {errors.password && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={login.isPending}
            >
              {login.isPending ? tAuth('buttonLoading') : tAuth('button')}
            </Button>

            <div className="text-center text-sm space-y-2">
              <p>
                <span className="text-neutral-600 dark:text-neutral-400">
                  {tAuth('noAccount')}{' '}
                </span>
                <Link
                  href="/register"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {tAuth('registerLink')}
                </Link>
              </p>
              <p>
                <span className="text-neutral-600 dark:text-neutral-400">
                  {tAuth('orBrowseEvents')}{' '}
                </span>
                <Link
                  href="/"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {tCommon('nav.events')}
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
