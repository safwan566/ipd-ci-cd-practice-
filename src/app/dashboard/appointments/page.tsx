'use client';

import React, { useMemo, useState } from 'react';
import { Plus, SlidersHorizontal } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import AppointmentStats from '@/features/appointments/components/AppointmentStats';
import AppointmentFilters from '@/features/appointments/components/AppointmentFilters';
import AppointmentTable from '@/features/appointments/components/AppointmentTable';
import AppointmentFormModal from '@/features/appointments/components/AppointmentFormModal';
import {
    Appointment,
    AppointmentFormInput,
    AppointmentStatus,
    AppointmentType,
} from '@/features/appointments/types';

const initialAppointments: Appointment[] = [
    {
        id: 1,
        patientName: 'Sophia Carter',
        doctorName: 'Dr. Olivia James',
        type: 'Consultation',
        status: 'Scheduled',
        date: '2026-02-03',
        time: '09:00 AM',
        duration: 30,
        room: 'Room 101',
        notes: 'First-time consultation for cardiac assessment',
    },
    {
        id: 2,
        patientName: 'Ethan Patel',
        doctorName: 'Dr. Maya Singh',
        type: 'Follow-up',
        status: 'In Progress',
        date: '2026-02-03',
        time: '10:30 AM',
        duration: 45,
        room: 'ICU-4',
        notes: 'Post-surgery follow-up',
    },
    {
        id: 3,
        patientName: 'Layla Turner',
        doctorName: 'Dr. Victor Lopez',
        type: 'Vaccination',
        status: 'Completed',
        date: '2026-02-02',
        time: '11:00 AM',
        duration: 15,
        room: 'PED-09',
    },
    {
        id: 4,
        patientName: 'Carlos Nguyen',
        doctorName: 'Dr. Amir Shah',
        type: 'Lab Test',
        status: 'Scheduled',
        date: '2026-02-04',
        time: '08:30 AM',
        duration: 60,
        room: 'Lab-3',
        notes: 'Blood work and X-ray scheduled',
    },
    {
        id: 5,
        patientName: 'Riley Brooks',
        doctorName: 'Dr. Hannah Lee',
        type: 'Therapy',
        status: 'Cancelled',
        date: '2026-02-03',
        time: '02:00 PM',
        duration: 60,
        room: 'REB-06',
        notes: 'Patient requested reschedule',
    },
    {
        id: 6,
        patientName: 'Maya Thompson',
        doctorName: 'Dr. Lucas Grant',
        type: 'Surgery',
        status: 'Scheduled',
        date: '2026-02-05',
        time: '07:00 AM',
        duration: 180,
        room: 'OR-2',
        notes: 'Pre-op completed, patient ready',
    },
    {
        id: 7,
        patientName: 'James Wilson',
        doctorName: 'Dr. Olivia James',
        type: 'Emergency',
        status: 'Completed',
        date: '2026-02-02',
        time: '03:45 PM',
        duration: 90,
        room: 'ER-1',
        notes: 'Chest pain assessment - stable',
    },
];

const types: AppointmentType[] = [
    'Consultation',
    'Follow-up',
    'Surgery',
    'Lab Test',
    'Therapy',
    'Vaccination',
    'Emergency',
];

const statuses: AppointmentStatus[] = ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'No Show'];

const patients = [
    'Sophia Carter',
    'Ethan Patel',
    'Layla Turner',
    'Carlos Nguyen',
    'Riley Brooks',
    'Maya Thompson',
    'James Wilson',
];

const doctors = [
    'Dr. Olivia James',
    'Dr. Maya Singh',
    'Dr. Victor Lopez',
    'Dr. Amir Shah',
    'Dr. Hannah Lee',
    'Dr. Lucas Grant',
];

export default function AppointmentsPage() {
    const { profile } = useUser();
    const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<AppointmentStatus | 'All'>('All');
    const [type, setType] = useState<AppointmentType | 'All'>('All');
    const [date, setDate] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const userPermissions = useMemo(() => profile?.permissions || [], [profile]);
    const canCreateAppointment = useMemo(() =>
        userPermissions.includes('appointments:create'),
        [userPermissions]
    );

    const filteredAppointments = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return appointments.filter((appointment) => {
            const matchesSearch =
                !normalizedSearch ||
                appointment.patientName.toLowerCase().includes(normalizedSearch) ||
                appointment.doctorName.toLowerCase().includes(normalizedSearch);

            const matchesStatus = status === 'All' || appointment.status === status;
            const matchesType = type === 'All' || appointment.type === type;
            const matchesDate = !date || appointment.date === date;

            return matchesSearch && matchesStatus && matchesType && matchesDate;
        });
    }, [appointments, search, status, type, date]);

    const stats = useMemo(() => {
        const total = appointments.length;
        const scheduled = appointments.filter((apt) => apt.status === 'Scheduled').length;
        const inProgress = appointments.filter((apt) => apt.status === 'In Progress').length;
        const completed = appointments.filter((apt) => apt.status === 'Completed').length;
        const cancelled = appointments.filter((apt) => apt.status === 'Cancelled').length;

        return { total, scheduled, inProgress, completed, cancelled };
    }, [appointments]);

    const handleOpenCreate = () => {
        setMode('create');
        setSelectedAppointment(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (appointment: Appointment) => {
        setMode('edit');
        setSelectedAppointment(appointment);
        setIsModalOpen(true);
    };

    const handleSubmit = (values: AppointmentFormInput) => {
        if (mode === 'create') {
            const newAppointment: Appointment = {
                id: appointments.length ? Math.max(...appointments.map((apt) => apt.id)) + 1 : 1,
                ...values,
            };
            setAppointments((prev) => [newAppointment, ...prev]);
        } else if (selectedAppointment) {
            setAppointments((prev) =>
                prev.map((apt) => (apt.id === selectedAppointment.id ? { ...apt, ...values } : apt))
            );
        }

        setIsModalOpen(false);
    };

    const handleComplete = (appointment: Appointment) => {
        setAppointments((prev) =>
            prev.map((apt) => (apt.id === appointment.id ? { ...apt, status: 'Completed' } : apt))
        );
    };

    const handleCancel = (appointment: Appointment) => {
        setAppointments((prev) =>
            prev.map((apt) => (apt.id === appointment.id ? { ...apt, status: 'Cancelled' } : apt))
        );
    };

    const handleClearFilters = () => {
        setSearch('');
        setStatus('All');
        setType('All');
        setDate('');
    };

    const modalInitialValues: AppointmentFormInput | undefined = selectedAppointment
        ? {
            patientName: selectedAppointment.patientName,
            doctorName: selectedAppointment.doctorName,
            type: selectedAppointment.type,
            status: selectedAppointment.status,
            date: selectedAppointment.date,
            time: selectedAppointment.time,
            duration: selectedAppointment.duration,
            room: selectedAppointment.room,
            notes: selectedAppointment.notes,
        }
        : undefined;

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-secondary uppercase tracking-wide">Scheduling</p>
                    <h1 className="text-3xl font-bold text-gray-900">Appointments Management</h1>
                    <p className="text-gray-600 mt-1">Schedule, track, and manage patient-doctor appointments.</p>
                </div>
                {canCreateAppointment && (
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleOpenCreate}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-white text-sm font-semibold hover:bg-green-600"
                        >
                            <Plus className="w-4 h-4" />
                            Schedule Appointment
                        </button>
                    </div>
                )}
            </div>

            <AppointmentStats
                total={stats.total}
                scheduled={stats.scheduled}
                inProgress={stats.inProgress}
                completed={stats.completed}
                cancelled={stats.cancelled}
            />

            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
            </div>

            <AppointmentFilters
                search={search}
                status={status}
                type={type}
                date={date}
                statuses={['All', ...statuses]}
                types={['All', ...types]}
                onSearchChange={setSearch}
                onStatusChange={setStatus}
                onTypeChange={setType}
                onDateChange={setDate}
                onClear={handleClearFilters}
            />

            <AppointmentTable
                appointments={filteredAppointments}
                onView={handleOpenEdit}
                onEdit={handleOpenEdit}
                onComplete={handleComplete}
                onCancel={handleCancel}
            />

            <AppointmentFormModal
                isOpen={isModalOpen}
                mode={mode}
                types={types}
                statuses={statuses}
                patients={patients}
                doctors={doctors}
                initialValues={modalInitialValues}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
