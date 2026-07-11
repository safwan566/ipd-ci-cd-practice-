'use client';

import React from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface AppointmentStatsProps {
    total: number;
    scheduled: number;
    inProgress: number;
    completed: number;
    cancelled: number;
}

const cards = [
    {
        label: 'Total',
        icon: Calendar,
        accent: 'text-blue-600',
        bg: 'bg-blue-50',
    },
    {
        label: 'Scheduled',
        icon: Clock,
        accent: 'text-amber-600',
        bg: 'bg-amber-50',
    },
    {
        label: 'In Progress',
        icon: AlertCircle,
        accent: 'text-purple-600',
        bg: 'bg-purple-50',
    },
    {
        label: 'Completed',
        icon: CheckCircle,
        accent: 'text-green-600',
        bg: 'bg-green-50',
    },
    {
        label: 'Cancelled',
        icon: XCircle,
        accent: 'text-rose-600',
        bg: 'bg-rose-50',
    },
];

const AppointmentStats: React.FC<AppointmentStatsProps> = ({ total, scheduled, inProgress, completed, cancelled }) => {
    const values = [total, scheduled, inProgress, completed, cancelled];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            {cards.map(({ label, icon: Icon, accent, bg }, index) => (
                <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center ${accent}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">{label}</p>
                        <p className="text-2xl font-semibold text-gray-900">{values[index]}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AppointmentStats;
