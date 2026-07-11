'use client';

import React from 'react';
import Link from 'next/link';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';
import { MailCheck } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(155deg, rgba(231, 255, 202, 1) 35%, rgba(138, 188, 166, 0.58) 50%, rgba(68, 184, 149, 0.7) 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-secondary to-green-600 p-3 rounded-full shadow-lg">
              <MailCheck className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
          <p className="text-gray-700 text-sm font-medium">We will email you a reset link</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-secondary to-green-600 px-6 py-8">
            <h2 className="text-2xl font-bold text-white text-center">Reset Your Password</h2>
            <p className="text-green-100 text-center text-sm mt-2">Enter your email to continue</p>
          </div>

          <div className="px-6 py-8">
            <ForgotPasswordForm />
          </div>

          <div className="bg-green-50 px-6 py-4 border-t border-green-200">
            <p className="text-center text-gray-700 text-sm">
              Remember your password?{' '}
              <Link href="/auth/login" className="font-semibold text-secondary hover:text-green-700 transition-colors">
                Back to sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
