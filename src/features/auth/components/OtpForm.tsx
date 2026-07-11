'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OtpSchema, OtpInput } from '@/types/user';
import { useUser } from '@/contexts/UserContext';
import { KeyRound, AlertCircle } from 'lucide-react';

interface OtpFormProps {
  userId: string;
}

export function OtpForm({ userId }: OtpFormProps) {
  const router = useRouter();
  const { verifyOtp, error, isLoading } = useUser();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<OtpInput>({
    resolver: zodResolver(OtpSchema),
    defaultValues: {
      userId,
      otp: '',
    },
  });

  useEffect(() => {
    setValue('userId', userId);
  }, [setValue, userId]);

  const onSubmit = async (data: OtpInput) => {
    try {
     const res = await verifyOtp(data);
     console.log('OTP verification response:', res);
      router.push('/dashboard');
    } catch (err) {
      console.error('OTP verification error:', err);
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

      <input type="hidden" {...register('userId')} />

      <div>
        <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2">
          One-Time Password
        </label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            {...register('otp')}
            type="text"
            id="otp"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent ${errors.otp
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 bg-gray-50 focus:bg-white'
              }`}
            placeholder="123456"
            disabled={isLoading}
          />
        </div>
        {errors.otp && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            {errors.otp.message}
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
            Verifying...
          </>
        ) : (
          'Verify OTP'
        )}
      </button>
    </form>
  );
}
