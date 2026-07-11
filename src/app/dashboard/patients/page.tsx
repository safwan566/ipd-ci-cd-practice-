'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Plus, SlidersHorizontal } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import PatientStats from '@/features/patients/components/PatientStats';
import PatientFilters from '@/features/patients/components/PatientFilters';
import PatientTable from '@/features/patients/components/PatientTable';
import PatientFormModal from '@/features/patients/components/PatientFormModal';
import {
    PatientFormInput,
    PatientRecord,
    PatientSex,
} from '@/features/patients/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const initialPatients: PatientRecord[] = [
    {
        id: '1',
        registrationNumber: 'REG-2026-0001',
        admissionDate: '2026-01-26T10:00:00Z',
        patientName: 'Sophia Carter',
        age: 34,
        dateOfBirth: '1991-02-12',
        sex: 'FEMALE',
        address: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            zipCode: '10001',
        },
        mobile: '+1 (555) 410-2001',
        nidNumber: '1234567890123',
        nidImageFront: '/uploads/nid-front.jpg',
        nidImageBack: '/uploads/nid-back.jpg',
    },
    {
        id: '2',
        registrationNumber: 'REG-2026-0002',
        admissionDate: '2026-02-02T14:30:00Z',
        patientName: 'Ethan Patel',
        age: 52,
        dateOfBirth: '1973-08-22',
        sex: 'MALE',
        address: {
            street: '88 River Rd',
            city: 'Boston',
            state: 'MA',
            country: 'USA',
            zipCode: '02111',
        },
        mobile: '+1 (555) 410-2002',
        nidNumber: '9876543210987',
        nidImageFront: '/uploads/nid-front.jpg',
        nidImageBack: '/uploads/nid-back.jpg',
    },
];

const sexes: PatientSex[] = ['MALE', 'FEMALE', 'OTHER'];

export default function PatientsPage() {
    const { profile } = useUser();
    const [patients, setPatients] = useState<PatientRecord[]>(initialPatients);
    const [search, setSearch] = useState('');
    const [sex, setSex] = useState<PatientSex | 'All'>('All');
    const [city, setCity] = useState<string | 'All'>('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const userPermissions = useMemo(() => profile?.permissions || [], [profile]);
    const canCreateAdmission = useMemo(() =>
        userPermissions.includes('admissions:create'),
        [userPermissions]
    );

    // Fetch admissions from API on mount
    useEffect(() => {
        const fetchAdmissions = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const authToken = localStorage.getItem('authToken');
                if (!authToken) {
                    throw new Error('No auth token found');
                }

                const response = await fetch(`${API_BASE_URL}/admissions`, {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch admissions: ${response.statusText}`);
                }

                const contentType = response.headers.get('content-type') || '';
                const apiData = contentType.includes('application/json')
                    ? await response.json()
                    : await response.text();

                // Handle different response formats
                const admissions = Array.isArray(apiData)
                    ? apiData
                    : apiData?.data || apiData?.admissions || [];

                setPatients(admissions.length > 0 ? admissions : initialPatients);
            } catch (err) {
                console.error('Error fetching admissions:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch admissions');
                // Fall back to initial patients on error
                setPatients(initialPatients);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdmissions();
    }, []);

    const filteredPatients = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return patients.filter((patient) => {
            const matchesSearch =
                !normalizedSearch ||
                patient.patientName.toLowerCase().includes(normalizedSearch) ||
                patient.registrationNumber.toLowerCase().includes(normalizedSearch) ||
                patient.mobile.toLowerCase().includes(normalizedSearch) ||
                patient.nidNumber.toLowerCase().includes(normalizedSearch);

            const matchesSex = sex === 'All' || patient.sex === sex;
            const matchesCity = city === 'All' || patient.address.city === city;

            return matchesSearch && matchesSex && matchesCity;
        });
    }, [patients, search, sex, city]);

    const stats = useMemo(() => {
        const total = patients.length;
        const male = patients.filter((patient) => patient.sex === 'MALE').length;
        const female = patients.filter((patient) => patient.sex === 'FEMALE').length;
        const other = patients.filter((patient) => patient.sex === 'OTHER').length;
        const recentCutoff = Date.now() - 1000 * 60 * 60 * 24 * 30;
        const recent = patients.filter((patient) => {
            const admittedAt = new Date(patient.admissionDate).getTime();
            return !Number.isNaN(admittedAt) && admittedAt >= recentCutoff;
        }).length;

        return { total, male, female, other, recent };
    }, [patients]);

    const handleOpenCreate = () => {
        setMode('create');
        setSelectedPatient(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (patient: PatientRecord) => {
        setMode('edit');
        setSelectedPatient(patient);
        setIsModalOpen(true);
    };

    const handleSubmit = async (values: PatientFormInput) => {
        setError(null);
        setIsSubmitting(true);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                throw new Error('No auth token found');
            }

            const payload = {
                ...values,
                admissionDate: new Date(values.admissionDate).toISOString(),
                nidImageFront: values.nidImageFront || '',
                nidImageBack: values.nidImageBack || '',
            };

            const response = await fetch(`${API_BASE_URL}/admissions`, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(payload),
            });

            const contentType = response.headers.get('content-type') || '';
            const apiPayload = contentType.includes('application/json')
                ? await response.json()
                : await response.text();

            if (!response.ok) {
                const message = typeof apiPayload === 'string'
                    ? apiPayload
                    : apiPayload?.message || apiPayload?.error || 'Failed to create admission';
                throw new Error(message);
            }

            const createdPatient = (typeof apiPayload === 'object'
                ? (apiPayload as { data?: PatientRecord }).data || (apiPayload as PatientRecord)
                : null) as PatientRecord | null;

            if (createdPatient) {
                setPatients((prev) => [createdPatient, ...prev]);
            } else {
                const fallbackPatient: PatientRecord = {
                    id: `${Date.now()}`,
                    registrationNumber: payload.registrationNumber,
                    admissionDate: payload.admissionDate,
                    patientName: payload.patientName,
                    age: payload.age,
                    dateOfBirth: payload.dateOfBirth,
                    sex: payload.sex,
                    address: payload.address,
                    mobile: payload.mobile,
                    nidNumber: payload.nidNumber,
                    nidImageFront: payload.nidImageFront,
                    nidImageBack: payload.nidImageBack,
                };
                setPatients((prev) => [fallbackPatient, ...prev]);
            }

            setIsModalOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create admission');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClearFilters = () => {
        setSearch('');
        setSex('All');
        setCity('All');
    };

    const modalInitialValues: PatientFormInput | undefined = selectedPatient
        ? {
            registrationNumber: selectedPatient.registrationNumber,
            admissionDate: selectedPatient.admissionDate.slice(0, 16),
            patientName: selectedPatient.patientName,
            age: selectedPatient.age,
            dateOfBirth: selectedPatient.dateOfBirth,
            sex: selectedPatient.sex,
            address: selectedPatient.address,
            mobile: selectedPatient.mobile,
            nidNumber: selectedPatient.nidNumber,
            nidImageFront: selectedPatient.nidImageFront,
            nidImageBack: selectedPatient.nidImageBack,
        }
        : undefined;

    return (
        <div className="p-6 ">
            <div className='space-y-6'>
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-secondary uppercase tracking-wide">Care Operations</p>
                        <h1 className="text-3xl font-bold text-gray-900">Patients Management</h1>
                        <p className="text-gray-600 mt-1">Monitor admissions, room assignments, and care status.</p>
                    </div>
                    {canCreateAdmission && (
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleOpenCreate}
                                disabled={isSubmitting || isLoading}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-white text-sm font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus className="w-4 h-4" />
                                Add Patient
                            </button>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                        {error}
                    </div>
                )}

                {isLoading && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-4 py-3 text-sm">
                        Loading admissions data...
                    </div>
                )}

                <PatientStats
                    total={stats.total}
                    male={stats.male}
                    female={stats.female}
                    other={stats.other}
                    recent={stats.recent}
                />

                <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                </div>

                <PatientFilters
                    search={search}
                    sex={sex}
                    city={city}
                    sexes={['All', ...sexes]}
                    cities={['All', ...Array.from(new Set(patients.map((patient) => patient.address.city)))]}
                    onSearchChange={setSearch}
                    onSexChange={setSex}
                    onCityChange={setCity}
                    onClear={handleClearFilters}
                />

                <PatientTable
                    patients={filteredPatients}
                    onView={handleOpenEdit}
                    onEdit={handleOpenEdit}
                />

            </div>
            <PatientFormModal
                isOpen={isModalOpen}
                mode={mode}
                initialValues={modalInitialValues}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
