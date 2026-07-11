'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { ImageUploadField } from '@/components/ImageUploadField';
import { PatientFormInput, PatientSex } from '@/features/patients/types';

interface PatientFormModalProps {
    isOpen: boolean;
    mode: 'create' | 'edit';
    initialValues?: PatientFormInput;
    onClose: () => void;
    onSubmit: (values: PatientFormInput) => void;
}

const emptyForm: PatientFormInput = {
    registrationNumber: '',
    admissionDate: new Date().toISOString().slice(0, 16),
    patientName: '',
    age: 0,
    dateOfBirth: '',
    sex: 'MALE',
    address: {
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
    },
    mobile: '',
    nidNumber: '',
    nidImageFront: null,
    nidImageBack: null,
};

export default function PatientFormModal({
    isOpen,
    mode,
    initialValues,
    onClose,
    onSubmit,
}: PatientFormModalProps) {
    const [form, setForm] = useState<PatientFormInput>(initialValues ?? emptyForm);

    useEffect(() => {
        if (isOpen) {
            setForm(initialValues ?? emptyForm);
        }
    }, [isOpen, initialValues]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-black/40 px-4">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {mode === 'create' ? 'Add Patient' : 'Edit Patient'}
                        </h2>
                        <p className="text-xs text-gray-500">Capture admission details and patient identity information.</p>
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
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Registration No.</label>
                            <input
                                value={form.registrationNumber}
                                onChange={(event) => setForm((prev) => ({ ...prev, registrationNumber: event.target.value }))}
                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="REG-2026-0001"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Admission Date</label>
                            <input
                                type="datetime-local"
                                value={form.admissionDate}
                                onChange={(event) => setForm((prev) => ({ ...prev, admissionDate: event.target.value }))}
                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Name</label>
                            <input
                                value={form.patientName}
                                onChange={(event) => setForm((prev) => ({ ...prev, patientName: event.target.value }))}
                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="Jordan Smith"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mobile</label>
                            <input
                                value={form.mobile}
                                onChange={(event) => setForm((prev) => ({ ...prev, mobile: event.target.value }))}
                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="+8801712345678"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Age</label>
                            <input
                                type="number"
                                min={0}
                                value={form.age}
                                onChange={(event) => setForm((prev) => ({ ...prev, age: Number(event.target.value) }))}
                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date of Birth</label>
                            <input
                                type="date"
                                value={form.dateOfBirth}
                                onChange={(event) => setForm((prev) => ({ ...prev, dateOfBirth: event.target.value }))}
                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sex</label>
                            <select
                                value={form.sex}
                                onChange={(event) => setForm((prev) => ({ ...prev, sex: event.target.value as PatientSex }))}
                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                            >
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">NID Number</label>
                            <input
                                value={form.nidNumber}
                                onChange={(event) => setForm((prev) => ({ ...prev, nidNumber: event.target.value }))}
                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="1234567890123"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Street Address</label>
                            <input
                                value={form.address.street}
                                onChange={(event) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        address: { ...prev.address, street: event.target.value },
                                    }))
                                }
                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="123 Main St"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">City</label>
                            <input
                                value={form.address.city}
                                onChange={(event) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        address: { ...prev.address, city: event.target.value },
                                    }))
                                }
                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="New York"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">State</label>
                            <input
                                value={form.address.state}
                                onChange={(event) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        address: { ...prev.address, state: event.target.value },
                                    }))
                                }
                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="NY"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Country</label>
                            <input
                                value={form.address.country}
                                onChange={(event) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        address: { ...prev.address, country: event.target.value },
                                    }))
                                }
                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="USA"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Zip Code</label>
                            <input
                                value={form.address.zipCode}
                                onChange={(event) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        address: { ...prev.address, zipCode: event.target.value },
                                    }))
                                }
                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="10001"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <ImageUploadField
                                label="NID Image (Front)"
                                value={form.nidImageFront}
                                onChange={(url) => setForm((prev) => ({ ...prev, nidImageFront: url }))}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <ImageUploadField
                                label="NID Image (Back)"
                                value={form.nidImageBack}
                                onChange={(url) => setForm((prev) => ({ ...prev, nidImageBack: url }))}
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
                            className="px-4 py-2 text-sm font-semibold text-white bg-secondary rounded-lg hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {mode === 'create' ? 'Add Patient' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
