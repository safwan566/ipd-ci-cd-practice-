'use client';

import React from 'react';
import { Eye, PencilLine } from 'lucide-react';
import { PatientRecord } from '@/features/patients/types';

interface PatientTableProps {
    patients: PatientRecord[];
    onView?: (patient: PatientRecord) => void;
    onEdit?: (patient: PatientRecord) => void;
}

const formatAdmissionDate = (value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return value;
    }
    return parsed.toLocaleString();
};

export default function PatientTable({ patients, onView, onEdit }: PatientTableProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="text-left px-6 py-3 font-semibold">Patient</th>
                            <th className="text-left px-6 py-3 font-semibold">Registration</th>
                            <th className="text-left px-6 py-3 font-semibold">Sex & Age</th>
                            <th className="text-left px-6 py-3 font-semibold">Admission</th>
                            <th className="text-left px-6 py-3 font-semibold">Contact</th>
                            <th className="text-left px-6 py-3 font-semibold">Address</th>
                            <th className="text-left px-6 py-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {patients.map((patient) => (
                            <tr key={patient.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-gray-900">{patient.patientName}</div>
                                    <div className="text-xs text-gray-500">NID {patient.nidNumber}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-700">{patient.registrationNumber}</td>
                                <td className="px-6 py-4 text-gray-700">{patient.sex} • {patient.age}</td>
                                <td className="px-6 py-4 text-gray-700">{formatAdmissionDate(patient.admissionDate)}</td>
                                <td className="px-6 py-4">
                                    <div className="text-gray-700">{patient.mobile}</div>
                                    <div className="text-xs text-gray-500">DOB {patient.dateOfBirth}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-gray-700">{patient.address.city}, {patient.address.state}</div>
                                    <div className="text-xs text-gray-500">{patient.address.country} {patient.address.zipCode}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onView?.(patient)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onEdit?.(patient)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-50"
                                        >
                                            <PencilLine className="w-4 h-4" />
                                            Edit
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {patients.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                                    No patients match your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
