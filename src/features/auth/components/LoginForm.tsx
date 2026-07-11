'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginInput } from '@/types/user';
import { useUser } from '@/contexts/UserContext';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  const { login, error, isLoading } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginInput) => {
    setIsSubmitting(true);
    try {
      await login(data);
      // router.push('/auth/verify-otp');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            {...register('email')}
            type="email"
            id="email"
            className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent ${errors.email
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 bg-gray-50 focus:bg-white'
              }`}
            placeholder="you@example.com"
            disabled={isSubmitting || isLoading}
          />
        </div>
        {errors.email && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            id="password"
            className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent ${errors.password
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 bg-gray-50 focus:bg-white'
              }`}
            placeholder="••••••••"
            disabled={isSubmitting || isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="w-full bg-gradient-to-r from-secondary to-green-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting || isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </button>

      <div className="text-center">
        <a
          href="/auth/forgot-password"
          className="text-sm font-semibold text-secondary hover:text-green-700 transition-colors"
        >
          Forgot password?
        </a>
      </div>
    </form>
  );
}
