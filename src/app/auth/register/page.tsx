'use client';

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, RegisterInput } from '@/types/user';
import { useUser } from '@/contexts/UserContext';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const { register: registerHook, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  });

  const { register } = useUser();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const onSubmit = async (data: RegisterInput) => {
    setIsSubmitting(true);
    try {
      await register(data);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight">Create your account</h2>
          <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-primary hover:opacity-80">
              Sign in here
            </Link>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow rounded-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Full Name
              </label>
              <input
                {...registerHook('name')}
                type="text"
                id="name"
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700"
                placeholder="John Doe"
              />
              {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                {...registerHook('email')}
                type="email"
                id="email"
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700"
                placeholder="user@example.com"
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  {...registerHook('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 pr-10 dark:bg-gray-700"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <input
                  {...registerHook('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 pr-10 dark:bg-gray-700"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-opacity-90 disabled:opacity-50 font-medium"
            >
              {isSubmitting ? 'Creating account...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
