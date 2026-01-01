'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { createRegisterSchema, type RegisterInput } from '@/lib/validation/schemas';
import { useRegister } from '@/hooks/auth/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function RegisterPage() {
  const t = useTranslations();
  const tAuth = useTranslations('auth.register');
  const tFields = useTranslations('auth.fields');
  const registerMutation = useRegister();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(createRegisterSchema(t)),
  });

  const onSubmit = (data: RegisterInput) => {
    registerMutation.mutate(data);
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
              <Label htmlFor="name">{tFields('name')}</Label>
              <Input
                id="name"
                type="text"
                placeholder={tFields('namePlaceholder')}
                {...registerField('name')}
                aria-invalid={errors.name ? 'true' : 'false'}
              />
              {errors.name && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{tFields('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={tFields('emailPlaceholder')}
                {...registerField('email')}
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
                {...registerField('password')}
                aria-invalid={errors.password ? 'true' : 'false'}
              />
              {errors.password && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                {tFields('passwordHint')}
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? tAuth('buttonLoading') : tAuth('button')}
            </Button>

            <div className="text-center text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">
                {tAuth('hasAccount')}{' '}
              </span>
              <Link
                href="/login"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                {tAuth('loginLink')}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
