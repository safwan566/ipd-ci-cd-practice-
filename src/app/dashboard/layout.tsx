'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SidebarProvider } from '@/contexts/SidebarContext';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <ProtectedRoute>
            <SidebarProvider>
                <div className="flex h-screen overflow-hidden py-2.5">
                    <Sidebar />
                    <div style={{ scrollbarWidth: 'none' }} className='mr-2.5 w-full bg-white h-[calc(100vh-38px)] overflow-auto rounded-2xl'>
                        <Navbar />
                        {children}
                    </div>
                </div>
            </SidebarProvider>
        </ProtectedRoute>
    );
}
