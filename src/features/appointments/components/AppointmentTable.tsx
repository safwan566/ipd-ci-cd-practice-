'use client';

import React from 'react';
import { Eye, PencilLine, CheckCircle, XCircle } from 'lucide-react';
import { Appointment } from '@/features/appointments/types';

interface AppointmentTableProps {
    appointments: Appointment[];
    onView?: (appointment: Appointment) => void;
    onEdit?: (appointment: Appointment) => void;
    onComplete?: (appointment: Appointment) => void;
    onCancel?: (appointment: Appointment) => void;
}

const statusStyles: Record<Appointment['status'], string> = {
    Scheduled: 'bg-amber-50 text-amber-700 border-amber-200',
    'In Progress': 'bg-purple-50 text-purple-700 border-purple-200',
    Completed: 'bg-green-50 text-green-700 border-green-200',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
    'No Show': 'bg-gray-100 text-gray-600 border-gray-200',
};

export default function AppointmentTable({ appointments, onView, onEdit, onComplete, onCancel }: AppointmentTableProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="text-left px-6 py-3 font-semibold">Date & Time</th>
                            <th className="text-left px-6 py-3 font-semibold">Patient</th>
                            <th className="text-left px-6 py-3 font-semibold">Doctor</th>
                            <th className="text-left px-6 py-3 font-semibold">Type</th>
                            <th className="text-left px-6 py-3 font-semibold">Status</th>
                            <th className="text-left px-6 py-3 font-semibold">Room</th>
                            <th className="text-left px-6 py-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {appointments.map((appointment) => (
                            <tr key={appointment.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-gray-900">{appointment.date}</div>
                                    <div className="text-xs text-gray-500">{appointment.time} • {appointment.duration} mins</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-gray-700 font-medium">{appointment.patientName}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-gray-700">{appointment.doctorName}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-700">{appointment.type}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[appointment.status]}`}>
                                        {appointment.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-700">{appointment.room}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onView?.(appointment)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onEdit?.(appointment)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-50"
                                        >
                                            <PencilLine className="w-4 h-4" />
                                            Edit
                                        </button>
                                        {appointment.status === 'Scheduled' && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => onComplete?.(appointment)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-green-600 border border-green-100 rounded-lg hover:bg-green-50"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    Complete
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onCancel?.(appointment)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 border border-rose-100 rounded-lg hover:bg-rose-50"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {appointments.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                                    No appointments match your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
