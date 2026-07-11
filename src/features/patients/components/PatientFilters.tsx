'use client';

import React from 'react';
import { Filter, Search } from 'lucide-react';
import { PatientSex } from '@/features/patients/types';

interface PatientFiltersProps {
    search: string;
    sex: PatientSex | 'All';
    city: string | 'All';
    sexes: Array<PatientSex | 'All'>;
    cities: Array<string | 'All'>;
    onSearchChange: (value: string) => void;
    onSexChange: (value: PatientSex | 'All') => void;
    onCityChange: (value: string | 'All') => void;
    onClear: () => void;
}

export default function PatientFilters({
    search,
    sex,
    city,
    sexes,
    cities,
    onSearchChange,
    onSexChange,
    onCityChange,
    onClear,
}: PatientFiltersProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Search</label>
                    <div className="relative mt-2">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            value={search}
                            onChange={(event) => onSearchChange(event.target.value)}
                            placeholder="Search by name, email, or phone"
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sex</label>
                        <select
                            value={sex}
                            onChange={(event) => onSexChange(event.target.value as PatientSex | 'All')}
                            className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                        >
                            {sexes.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">City</label>
                        <select
                            value={city}
                            onChange={(event) => onCityChange(event.target.value as string | 'All')}
                            className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                        >
                            {cities.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClear}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <Filter className="w-4 h-4" />
                    Clear Filters
                </button>
            </div>
        </div>
    );
}
