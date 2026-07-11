import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['admin', 'user', 'moderator']),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const OtpSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  otp: z.string().min(6, 'OTP must be 6 characters'),
});

export type OtpInput = z.infer<typeof OtpSchema>;

export const ForgotPasswordSchema = z.object({
  identifier: z.string().email('Invalid email address'),
  channel: z.enum(['EMAIL']),
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6),
  name: z.string().min(2, 'Name must be at least 2 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export type ProfileAddress = {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
};

export type EmergencyContact = {
  name: string;
  phoneNumber: string;
  relationship?: string;
};

export type Profile = {
  id: string;
  userId: string;
  email: string;
  role: string;
  userName: string;
  avatar: string | null;
  bio: string | null;
  dateOfBirth: string | null;
  age: number | null;
  gender: string | null;
  bloodGroup: string | null;
  address: ProfileAddress | null;
  emergencyContact: EmergencyContact | null;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
};

export type ProfileUpdateInput = {
  avatar?: string | null;
  bio?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  bloodGroup?: string | null;
  address?: ProfileAddress | null;
  emergencyContact?: EmergencyContact | null;
};

export type TwoFactorSettings = {
  context: 'LOGIN';
  enabled: boolean;
};
