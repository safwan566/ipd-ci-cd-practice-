'use client';

import React from 'react';
import Link from 'next/link';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { HeartHandshake } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen  overflow-visible  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(155deg, rgba(231, 255, 202, 1) 35%, rgba(138, 188, 166, 0.58) 50%, rgba(68, 184, 149, 0.7) 100%)' }}>
      <div className="w-full  min-h-[800px] overflow-auto max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-secondary to-green-600 p-3 rounded-full shadow-lg">
              <HeartHandshake className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <span className="italic">Smarts</span><span className="font-normal">Care</span>
          </h1>
          <p className="text-gray-700 text-sm font-medium">Healthcare Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-secondary to-green-600 px-6 py-8">
            <h2 className="text-2xl font-bold text-white text-center">Welcome Back after complete the ci/cd</h2>
            <p className="text-green-100 text-center text-sm mt-2">Sign in to your account to continue</p>
          </div>

          <div className="px-6 py-8">
            <LoginForm />
          </div>

          {/* Footer Section */}
          <div className="bg-green-50 px-6 py-4 border-t border-green-200">
            <p className="text-center text-gray-700 text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="font-semibold text-secondary hover:text-green-700 transition-colors">
                Create one now
              </Link>
            </p>
          </div>
        </div>

       
      </div>
    </div>
  );
}
