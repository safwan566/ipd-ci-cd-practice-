'use client';

import React from 'react';
import { CalendarPlus, Users, UserSquare2 } from 'lucide-react';

interface PatientStatsProps {
    total: number;
    male: number;
    female: number;
    other: number;
    recent: number;
}

const cards = [
    {
        label: 'Total Patients',
        icon: Users,
        accent: 'text-blue-600',
        bg: 'bg-blue-50',
    },
    {
        label: 'Male',
        icon: UserSquare2,
        accent: 'text-green-600',
        bg: 'bg-green-50',
    },
    {
        label: 'Female',
        icon: UserSquare2,
        accent: 'text-rose-600',
        bg: 'bg-rose-50',
    },
    {
        label: 'Other',
        icon: UserSquare2,
        accent: 'text-amber-600',
        bg: 'bg-amber-50',
    },
    {
        label: 'Recent Admissions',
        icon: CalendarPlus,
        accent: 'text-gray-600',
        bg: 'bg-gray-100',
    },
];

const PatientStats: React.FC<PatientStatsProps> = ({ total, male, female, other, recent }) => {
    const values = [total, male, female, other, recent];

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

export default PatientStats;
