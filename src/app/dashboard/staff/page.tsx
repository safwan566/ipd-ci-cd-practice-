'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, SlidersHorizontal } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import StaffStats from '@/features/staff/components/StaffStats';
import StaffFilters from '@/features/staff/components/StaffFilters';
import StaffTable from '@/features/staff/components/StaffTable';
import StaffFormModal from '@/features/staff/components/StaffFormModal';
import { StaffFormInput, StaffMember, StaffMeta, StaffStatus } from '@/features/staff/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function StaffPage() {
    const { profile } = useUser();
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('All');
    const [status, setStatus] = useState<StaffStatus | 'All'>('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit'>('edit');
    const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);
    const [meta, setMeta] = useState<StaffMeta | null>(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);

    const userPermissions = useMemo(() => profile?.permissions || [], [profile]);
    const canCreateUser = useMemo(() =>
        userPermissions.includes('users:create'),
        [userPermissions]
    );

    const roles = useMemo(() => {
        const unique = Array.from(new Set(staff.map((member) => member.role)));
        return ['All', ...unique];
    }, [meta, staff]);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                throw new Error('No auth token found');
            }

            const response = await fetch(`${API_BASE_URL}/users?page=${page}&limit=${limit}`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
            });

            const contentType = response.headers.get('content-type') || '';
            const payload = contentType.includes('application/json')
                ? await response.json()
                : await response.text();

            if (!response.ok) {
                const message = typeof payload === 'string'
                    ? payload
                    : payload?.message || payload?.error || 'Failed to load users';
                throw new Error(message);
            }

            const data = (payload as { data?: StaffMember[] }).data || [];
            const metaInfo = (payload as { meta?: StaffMeta }).meta || null;

            setStaff(data);
            setMeta(metaInfo);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load users');
        } finally {
            setIsLoading(false);
        }
    }, [limit, page]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const filteredStaff = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return staff.filter((member) => {
            const matchesSearch =
                !normalizedSearch ||
                `${member.firstName} ${member.lastName}`.toLowerCase().includes(normalizedSearch) ||
                member.email.toLowerCase().includes(normalizedSearch) ||
                member.phoneNumber.toLowerCase().includes(normalizedSearch);

            const matchesRole = role === 'All' || member.role === role;
            const matchesStatus = status === 'All' || (member.isActive ? 'Active' : 'Inactive') === status;

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [staff, search, role, status]);

    const stats = useMemo(() => {
        const total = meta?.total ?? staff.length;
        const active = staff.filter((member) => member.isActive).length;
        const inactive = staff.filter((member) => !member.isActive).length;

        return { total, active, inactive };
    }, [staff]);

    const handleOpenCreate = () => {
        setMode('create');
        setSelectedMember(null);
        setFormError(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (member: StaffMember) => {
        setMode('edit');
        setSelectedMember(member);
        setFormError(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setFormError(null);
        setIsModalOpen(false);
    };

    const handleSubmit = async (values: StaffFormInput) => {
        setFormError(null);
        setIsSubmittingForm(true);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                throw new Error('No auth token found');
            }

            if (mode === 'edit') {
                if (!selectedMember) {
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/users/${selectedMember.id}`, {
                    method: 'PATCH',
                    headers: {
                        accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify(values),
                });

                const contentType = response.headers.get('content-type') || '';
                const payload = contentType.includes('application/json')
                    ? await response.json()
                    : await response.text();

                if (!response.ok) {
                    const message = typeof payload === 'string'
                        ? payload
                        : payload?.message || payload?.error || 'Failed to update user';
                    throw new Error(message);
                }

                const updatedUser = (typeof payload === 'object'
                    ? (payload as { data?: StaffMember }).data || (payload as StaffMember)
                    : null) as StaffMember | null;

                setStaff((prev) => prev.map((member) => (member.id === selectedMember.id ? { ...member, ...values, ...updatedUser } : member)));
            } else {
                const createPayload = {
                    email: values.email,
                    password: values.password,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    phoneNumber: values.phoneNumber,
                    role: values.role,
                    specialization: values.specialization,
                    licenseNumber: values.licenseNumber,
                    qualifications: values.qualifications ?? [],
                    experienceYears: values.experienceYears,
                    consultationFee: values.consultationFee,
                    assignedWard: values.assignedWard,
                    duties: values.duties ?? [],
                };

                // Create mode
                const response = await fetch(`${API_BASE_URL}/users`, {
                    method: 'POST',
                    headers: {
                        accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify(createPayload),
                });

                const contentType = response.headers.get('content-type') || '';
                const payload = contentType.includes('application/json')
                    ? await response.json()
                    : await response.text();

                if (!response.ok) {
                    const message = typeof payload === 'string'
                        ? payload
                        : payload?.message || payload?.error || 'Failed to create user';
                    throw new Error(message);
                }

                const newUser = (typeof payload === 'object'
                    ? (payload as { data?: StaffMember }).data || (payload as StaffMember)
                    : null) as StaffMember | null;

                if (newUser) {
                    setStaff((prev) => [newUser, ...prev]);
                }
            }
            setFormError(null);
            setIsModalOpen(false);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to process request';
            setFormError(message);
        } finally {
            setIsSubmittingForm(false);
        }
    };

    const handleToggleStatus = async (member: StaffMember) => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                throw new Error('No auth token found');
            }

            const nextActive = !member.isActive;
            const endpoint = nextActive ? 'activate' : 'deactivate';
            const response = await fetch(`${API_BASE_URL}/users/${member.id}/${endpoint}`, {
                method: 'PATCH',
                headers: {
                    accept: '*/*',
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                const contentType = response.headers.get('content-type') || '';
                const payload = contentType.includes('application/json')
                    ? await response.json()
                    : await response.text();
                const message = typeof payload === 'string'
                    ? payload
                    : payload?.message || payload?.error || 'Failed to update status';
                throw new Error(message);
            }

            setStaff((prev) => prev.map((item) => (item.id === member.id ? { ...item, isActive: nextActive } : item)));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update status');
        }
    };

    const handleDelete = async (member: StaffMember) => {
        const confirmed = window.confirm(`Delete ${member.firstName} ${member.lastName}?`);
        if (!confirmed) {
            return;
        }

        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                throw new Error('No auth token found');
            }

            const response = await fetch(`${API_BASE_URL}/users/${member.id}`, {
                method: 'DELETE',
                headers: {
                    accept: '*/*',
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                const contentType = response.headers.get('content-type') || '';
                const payload = contentType.includes('application/json')
                    ? await response.json()
                    : await response.text();
                const message = typeof payload === 'string'
                    ? payload
                    : payload?.message || payload?.error || 'Failed to delete user';
                throw new Error(message);
            }

            setStaff((prev) => prev.filter((item) => item.id !== member.id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete user');
        }
    };

    const handleClearFilters = () => {
        setSearch('');
        setRole('All');
        setStatus('All');
    };

    const modalInitialValues: StaffFormInput | undefined = useMemo(() => {
        if (selectedMember) {
            return {
                firstName: selectedMember.firstName,
                lastName: selectedMember.lastName,
                phoneNumber: selectedMember.phoneNumber,
            };
        }

        if (mode === 'create') {
            return {
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
        }

        return undefined;
    }, [mode, selectedMember]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-secondary uppercase tracking-wide">Operations</p>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600 mt-1">View, update, and manage platform users.</p>
                </div>
                <div className="flex items-center gap-3">
                    {canCreateUser && (
                        <button
                            type="button"
                            onClick={handleOpenCreate}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-white text-sm font-semibold hover:bg-green-600"
                        >
                            + Add Staff
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={fetchUsers}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-white text-sm font-semibold hover:bg-green-600"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                    {error}
                </div>
            )}

            <StaffStats total={stats.total} active={stats.active} inactive={stats.inactive} />

            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
            </div>

            <StaffFilters
                search={search}
                role={role}
                status={status}
                roles={roles}
                statuses={['All', 'Active', 'Inactive']}
                onSearchChange={setSearch}
                onRoleChange={setRole}
                onStatusChange={setStatus}
                onClear={handleClearFilters}
            />

            <StaffTable
                staff={filteredStaff}
                onEdit={handleOpenEdit}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
            />

            <StaffFormModal
                isOpen={isModalOpen}
                mode={mode}
                initialValues={modalInitialValues}
                submitError={formError}
                isSubmitting={isSubmittingForm}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
            />

            {meta && (
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                        Page {meta.page} of {meta.totalPages} (Total {meta.total})
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={meta.page <= 1 || isLoading}
                            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                            className="px-3 py-1 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            disabled={meta.page >= meta.totalPages || isLoading}
                            onClick={() => setPage((prev) => Math.min(meta.totalPages, prev + 1))}
                            className="px-3 py-1 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
