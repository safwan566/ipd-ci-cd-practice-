'use client';

import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { useTheme } from '@/contexts/ThemeContext';

export function DashboardHeader() {
  const { user, logout } = useUser();
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-900 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome, {user?.name}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
            title="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
