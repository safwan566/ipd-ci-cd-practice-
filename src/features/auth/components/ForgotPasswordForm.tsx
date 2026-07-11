'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ForgotPasswordSchema, ForgotPasswordInput } from '@/types/user';
import { useUser } from '@/contexts/UserContext';
import { Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

export function ForgotPasswordForm() {
  const { forgotPassword, error, isLoading } = useUser();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      identifier: '',
      channel: 'EMAIL',
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      await forgotPassword(data);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Forgot password error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {isSubmitted && !error && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-700">Check your email for reset instructions.</p>
        </div>
      )}

      <input type="hidden" {...register('channel')} value="EMAIL" />

      <div>
        <label htmlFor="identifier" className="block text-sm font-semibold text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            {...register('identifier')}
            type="email"
            id="identifier"
            className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent ${errors.identifier
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 bg-gray-50 focus:bg-white'
              }`}
            placeholder="you@example.com"
            disabled={isLoading}
          />
        </div>
        {errors.identifier && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            {errors.identifier.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-secondary to-green-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Sending...
          </>
        ) : (
          'Send Reset Link'
        )}
      </button>
    </form>
  );
}
