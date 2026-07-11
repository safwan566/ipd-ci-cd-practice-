'use client';

import React from 'react';































































import { Users, UserCheck, UserX } from 'lucide-react';

interface StaffStatsProps {
    total: number;
    active: number;
    inactive: number;
}

const StaffStats: React.FC<StaffStatsProps> = ({ total, active, inactive }) => {
    const cards = [
        {
            label: 'Total Users',
            value: total,
            icon: Users,
            accent: 'text-green-600',
            bg: 'bg-green-50'
        },
        {
            label: 'Active',
            value: active,
            icon: UserCheck,
            accent: 'text-emerald-600',
            bg: 'bg-emerald-50'
        },
        {
            label: 'Inactive',
            value: inactive,
            icon: UserX,
            accent: 'text-red-600',
            bg: 'bg-red-50'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {cards.map(({ label, value, icon: Icon, accent, bg }) => (
                <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center ${accent}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">{label}</p>
                        <p className="text-2xl font-semibold text-gray-900">{value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StaffStats;
