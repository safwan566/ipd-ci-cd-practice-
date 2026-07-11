import React from 'react';
import { PencilLine, Power, Trash2 } from 'lucide-react';
import { StaffMember, StaffStatus } from '@/features/staff/types';

interface StaffTableProps {
    staff: StaffMember[];
    onEdit?: (member: StaffMember) => void;
    onToggleStatus?: (member: StaffMember) => void;
    onDelete?: (member: StaffMember) => void;
}

const statusStyles: Record<StaffStatus, string> = {
    Active: 'bg-green-50 text-green-700 border-green-200',
    Inactive: 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function StaffTable({ staff, onEdit, onToggleStatus, onDelete }: StaffTableProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="text-center px-6 py-3 font-semibold ">User</th>
                            <th className="text-center px-6 py-3 font-semibold ">Role</th>
                            <th className="text-center px-6 py-3 font-semibold ">Status</th>
                            <th className="text-center px-6 py-3 font-semibold  ">Contact</th>
                            <th className="text-center px-6 py-3 font-semibold ">Created</th>
                            <th className="text-center px-6 py-3 font-semibold ">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {staff.map((member) => (
                            <tr key={member.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-center">
                                    <div className="font-semibold text-gray-900">{member.firstName} {member.lastName}</div>
                                    <div className="text-xs text-gray-500">{member.email}</div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="text-gray-700">{member.role}</div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[member.isActive ? 'Active' : 'Inactive']}`}>
                                        {member.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="text-gray-700">{member.phoneNumber}</div>
                                </td>
                                <td className="px-6 py-4 text-center text-gray-700">
                                    {new Date(member.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onEdit?.(member)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-50"
                                        >
                                            <PencilLine className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onToggleStatus?.(member)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-amber-600 border border-amber-100 rounded-lg hover:bg-amber-50"
                                        >
                                            <Power className="w-4 h-4" />
                                            {member.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete?.(member)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 border border-rose-100 rounded-lg hover:bg-rose-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {staff.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                    No users match your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
