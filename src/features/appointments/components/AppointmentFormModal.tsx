'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { AppointmentFormInput, AppointmentStatus, AppointmentType } from '@/features/appointments/types';

interface AppointmentFormModalProps {
    isOpen: boolean;
    mode: 'create' | 'edit';
    types: AppointmentType[];
    statuses: AppointmentStatus[];
    patients: string[];
    doctors: string[];
    initialValues?: AppointmentFormInput;
    onClose: () => void;
    onSubmit: (values: AppointmentFormInput) => void;
}

const emptyForm: AppointmentFormInput = {
    patientName: 'Sophia Carter',
    doctorName: 'Dr. Olivia James',
    type: 'Consultation',
    status: 'Scheduled',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: 30,
    room: 'Room 101',
    notes: '',
};

export default function AppointmentFormModal({
    isOpen,
    mode,
    types,
    statuses,
    patients,
    doctors,
    initialValues,
    onClose,
    onSubmit,
}: AppointmentFormModalProps) {
    const [form, setForm] = useState<AppointmentFormInput>(initialValues ?? emptyForm);

    useEffect(() => {
        if (isOpen) {
            setForm(initialValues ?? emptyForm);
        }
    }, [isOpen, initialValues]);

    const isValid = useMemo(() => {
        return form.patientName.trim() && form.doctorName.trim() && form.date && form.time && form.duration > 0;
    }, [form]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {mode === 'create' ? 'Schedule Appointment' : 'Edit Appointment'}
                        </h2>
                        <p className="text-xs text-gray-500">Manage patient-doctor appointments and time slots.</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        onSubmit(form);
                    }}
                    className="px-6 py-4 space-y-4"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Patient Name</label>
                            <select
                                value={form.patientName}
                                onChange={(event) => setForm((prev) => ({ ...prev, patientName: event.target.value }))}
                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                required
                            >
                                {patients.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Doctor Name</label>
                            <select
                                value={form.doctorName}
                                onChange={(event) => setForm((prev) => ({ ...prev, doctorName: event.target.value }))}
                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                required
                            >
                                {doctors.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Appointment Type</label>
                            <select
                                value={form.type}
                                onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value as AppointmentType }))}
                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                            >
                                {types.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</label>
                            <select
                                value={form.status}
                                onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as AppointmentStatus }))}
                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                            >
                                {statuses.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</label>
                            <input
                                type="date"
                                value={form.date}
                                onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Time</label>
                            <input
                                type="time"
                                value={form.time}
                                onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))}
                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Duration (mins)</label>
                            <input
                                type="number"
                                min={15}
                                step={15}
                                value={form.duration}
                                onChange={(event) => setForm((prev) => ({ ...prev, duration: Number(event.target.value) }))}
                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Room</label>
                            <input
                                value={form.room}
                                onChange={(event) => setForm((prev) => ({ ...prev, room: event.target.value }))}
                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="Room 101"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notes</label>
                            <textarea
                                value={form.notes}
                                onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="Additional notes or instructions..."
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isValid}
                            className="px-4 py-2 text-sm font-semibold text-white bg-secondary rounded-lg hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {mode === 'create' ? 'Schedule' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
