import { useMutation } from '@tanstack/react-query';
import { LoginInput, RegisterInput } from '@/types/user';
import { AuthResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginInput): Promise<AuthResponse> => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      return response.json();
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterInput): Promise<AuthResponse> => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      return response.json();
    },
  });
}
