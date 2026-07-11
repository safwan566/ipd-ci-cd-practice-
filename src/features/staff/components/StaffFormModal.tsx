import React, { useEffect, useMemo, useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { StaffFormInput } from '@/features/staff/types';

interface StaffFormModalProps {
    isOpen: boolean;
    mode: 'create' | 'edit';
    initialValues?: StaffFormInput;
    submitError?: string | null;
    isSubmitting?: boolean;
    onClose: () => void;
    onSubmit: (values: StaffFormInput) => void | Promise<void>;
}

const emptyForm: StaffFormInput = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: 'DOCTOR',
    specialization: '',
    licenseNumber: '',
    qualifications: [],
    experienceYears: 0,
    consultationFee: 0,
    assignedWard: '',
    duties: [],
};

export default function StaffFormModal({
    isOpen,
    mode,
    initialValues,
    submitError,
    isSubmitting = false,
    onClose,
    onSubmit,
}: StaffFormModalProps) {
    const [form, setForm] = useState<StaffFormInput>(initialValues ?? emptyForm);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setForm({ ...emptyForm, ...(initialValues ?? {}) });
            setShowPassword(false);
        }
    }, [isOpen, initialValues]);

    const isValid = useMemo(() => {
        const hasBaseFields = form.firstName.trim() && form.lastName.trim() && form.phoneNumber.trim();

        if (mode === 'edit') {
            return hasBaseFields;
        }

        return hasBaseFields && form.email?.trim() && form.password?.trim() && form.role?.trim();
    }, [form, mode]);

    const normalizedSubmitError = (submitError ?? '').toLowerCase();

    const fieldError = (keywords: string[]) => {
        if (!normalizedSubmitError) {
            return null;
        }

        const hasMatch = keywords.some((keyword) => normalizedSubmitError.includes(keyword));
        return hasMatch ? submitError : null;
    };

    const emailError = fieldError(['email']);
    const passwordError = fieldError(['password']);
    const firstNameError = fieldError(['firstname', 'first name']);
    const lastNameError = fieldError(['lastname', 'last name']);
    const phoneError = fieldError(['phonenumber', 'phone number', 'phone']);
    const roleError = fieldError(['role']);
    const specializationError = fieldError(['specialization']);
    const licenseError = fieldError(['licensenumber', 'license number', 'license']);
    const qualificationError = fieldError(['qualification', 'qualifications']);
    const experienceError = fieldError(['experienceyears', 'experience years', 'experience']);
    const consultationFeeError = fieldError(['consultationfee', 'consultation fee', 'fee']);
    const assignedWardError = fieldError(['assignedward', 'assigned ward', 'ward']);
    const dutiesError = fieldError(['duties', 'duty']);

    const hasAnyFieldError = Boolean(
        emailError ||
        passwordError ||
        firstNameError ||
        lastNameError ||
        phoneError ||
        roleError ||
        specializationError ||
        licenseError ||
        qualificationError ||
        experienceError ||
        consultationFeeError ||
        assignedWardError ||
        dutiesError,
    );

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {mode === 'create' ? 'Add User' : 'Edit User'}
                        </h2>
                        <p className="text-xs text-gray-500">
                            {mode === 'create'
                                ? 'Create a new staff account.'
                                : 'Update contact details for this user.'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form
                    onSubmit={async (event) => {
                        event.preventDefault();
                        await onSubmit(form);
                    }}
                    className="px-6 py-4 space-y-4"
                >
                    {mode === 'create' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</label>
                                <input
                                    type="email"
                                    value={form.email ?? ''}
                                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                                    className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                    placeholder="user@hospital.com"
                                    required
                                />
                                {emailError && <p className="mt-1 text-xs text-red-600">{emailError}</p>}
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Password</label>
                                <div className="relative mt-2">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={form.password ?? ''}
                                        onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                        placeholder="StrongP@ss1"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {passwordError && <p className="mt-1 text-xs text-red-600">{passwordError}</p>}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">First Name</label>
                            <input
                                value={form.firstName}
                                onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="John"
                                required
                            />
                            {firstNameError && <p className="mt-1 text-xs text-red-600">{firstNameError}</p>}
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Name</label>
                            <input
                                value={form.lastName}
                                onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="Doe"
                                required
                            />
                            {lastNameError && <p className="mt-1 text-xs text-red-600">{lastNameError}</p>}
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</label>
                            <input
                                value={form.phoneNumber}
                                onChange={(event) => setForm((prev) => ({ ...prev, phoneNumber: event.target.value }))}
                                className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="+1 (555) 123-4567"
                                required
                            />
                            {phoneError && <p className="mt-1 text-xs text-red-600">{phoneError}</p>}
                        </div>
                        {mode === 'create' && (
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</label>
                                <select
                                    value={form.role ?? 'DOCTOR'}
                                    onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
                                    className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                    required
                                >
                                    <option value="DOCTOR">DOCTOR</option>
                                    <option value="NURSE">NURSE</option>
                                    <option value="RECEPTIONIST">RECEPTIONIST</option>
                                    <option value="STAFF">STAFF</option>
                                </select>
                                {roleError && <p className="mt-1 text-xs text-red-600">{roleError}</p>}
                            </div>
                        )}
                    </div>

                    {mode === 'create' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Specialization</label>
                                <input
                                    value={form.specialization ?? ''}
                                    onChange={(event) => setForm((prev) => ({ ...prev, specialization: event.target.value }))}
                                    className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                    placeholder="Cardiology"
                                />
                                {specializationError && <p className="mt-1 text-xs text-red-600">{specializationError}</p>}
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">License Number</label>
                                <input
                                    value={form.licenseNumber ?? ''}
                                    onChange={(event) => setForm((prev) => ({ ...prev, licenseNumber: event.target.value }))}
                                    className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                    placeholder="DOC123456"
                                />
                                {licenseError && <p className="mt-1 text-xs text-red-600">{licenseError}</p>}
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Qualifications (comma separated)</label>
                                <input
                                    value={(form.qualifications ?? []).join(', ')}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            qualifications: event.target.value
                                                .split(',')
                                                .map((item) => item.trim())
                                                .filter(Boolean),
                                        }))
                                    }
                                    className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                    placeholder="MBBS, MD"
                                />
                                {qualificationError && <p className="mt-1 text-xs text-red-600">{qualificationError}</p>}
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Duties (comma separated)</label>
                                <input
                                    value={(form.duties ?? []).join(', ')}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            duties: event.target.value
                                                .split(',')
                                                .map((item) => item.trim())
                                                .filter(Boolean),
                                        }))
                                    }
                                    className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                    placeholder="cleaning, patient-assist"
                                />
                                {dutiesError && <p className="mt-1 text-xs text-red-600">{dutiesError}</p>}
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Experience Years</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={form.experienceYears ?? 0}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            experienceYears: Number(event.target.value),
                                        }))
                                    }
                                    className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                />
                                {experienceError && <p className="mt-1 text-xs text-red-600">{experienceError}</p>}
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Consultation Fee</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={form.consultationFee ?? 0}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            consultationFee: Number(event.target.value),
                                        }))
                                    }
                                    className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                />
                                {consultationFeeError && <p className="mt-1 text-xs text-red-600">{consultationFeeError}</p>}
                            </div>
                            <div className="sm:col-span-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Assigned Ward</label>
                                <input
                                    value={form.assignedWard ?? ''}
                                    onChange={(event) => setForm((prev) => ({ ...prev, assignedWard: event.target.value }))}
                                    className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                                    placeholder="Ward A"
                                />
                                {assignedWardError && <p className="mt-1 text-xs text-red-600">{assignedWardError}</p>}
                            </div>
                        </div>
                    )}

                    {submitError && !hasAnyFieldError && (
                        <p className="text-sm text-red-600">{submitError}</p>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className="px-4 py-2 text-sm font-semibold text-white bg-secondary rounded-lg hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Saving...' : mode === 'create' ? 'Add User' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
