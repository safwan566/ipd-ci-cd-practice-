export type StaffStatus = 'Active' | 'Inactive';

export interface StaffMember {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StaffFormInput {
  email?: string;
  password?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role?: string;
  specialization?: string;
  licenseNumber?: string;
  qualifications?: string[];
  experienceYears?: number;
  consultationFee?: number;
  assignedWard?: string;
  duties?: string[];
}

export interface StaffMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
