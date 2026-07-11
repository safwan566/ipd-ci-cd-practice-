'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OtpForm } from '@/features/auth/components/OtpForm';
import { ShieldCheck } from 'lucide-react';

export default function VerifyOtpPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('pendingUserId');
    if (!storedUserId) {
      router.push('/auth/login');
      return;
    }
    setUserId(storedUserId);
  }, [router]);

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(155deg, rgba(231, 255, 202, 1) 35%, rgba(138, 188, 166, 0.58) 50%, rgba(68, 184, 149, 0.7) 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-secondary to-green-600 p-3 rounded-full shadow-lg">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h1>
          <p className="text-gray-700 text-sm font-medium">Enter the code sent to your device</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-secondary to-green-600 px-6 py-8">
            <h2 className="text-2xl font-bold text-white text-center">Security Check</h2>
            <p className="text-green-100 text-center text-sm mt-2">Complete verification to continue</p>
          </div>

          <div className="px-6 py-8">
            <OtpForm userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
}
