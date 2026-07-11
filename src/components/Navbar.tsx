'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user, profile, logout } = useUser();
    const router = useRouter();

    console.log(' user:', user, 'profile:', profile);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        router.push('/auth/login');
    };

    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-1 sticky top-0 z-10">
            <div className="flex items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="flex-1 max-w-xl">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search patients, appointments, tests..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white transition-all"
                        />
                        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-semibold text-gray-500 bg-white border border-gray-200 rounded">
                            Ctrl + K
                        </kbd>
                    </div>
                </div>





                {/* Profile Dropdown */}
                <div className="relative flex items-center gap-1    " ref={dropdownRef}>
                    {/* Notifications */}
                    <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Bell className="w-5 h-5 text-gray-700" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <div>   <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
                    >
                        <div className="w-10 h-10 bg-gradient-to-r from-secondary to-green-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                            {profile?.avatar ? (
                                <img src={profile.avatar} alt="User avatar" className="w-full h-full object-cover" />
                            ) : (
                                user?.name?.charAt(0) || 'U'
                            )}
                        </div>
                        <div className="text-left hidden md:block">
                            <p className="text-sm font-semibold text-gray-900">{profile?.emergencyContact?.name || 'User'}</p>
                            <p className="text-xs text-gray-500 capitalize">{user?.role || 'Member'}</p>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                </div>

                                <button
                                    onClick={() => {
                                        router.push('/dashboard/profile');
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <User className="w-4 h-4" />
                                    My Profile
                                </button>

                                <button
                                    onClick={() => {
                                        router.push('/dashboard/settings');
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </button>

                                <div className="border-t border-gray-100 my-2"></div>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        )}</div>
                </div>
            </div>
        </nav>
    );
}
