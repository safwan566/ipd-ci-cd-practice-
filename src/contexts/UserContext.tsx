'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { User, LoginInput, RegisterInput, OtpInput, ForgotPasswordInput, Profile, ProfileUpdateInput, TwoFactorSettings } from '@/types/user';
import { useRouter } from 'next/navigation';

interface UserContextType {
  user: User | null;
  profile: Profile | null;
  twoFactorSettings: TwoFactorSettings | null;
  isLoading: boolean;
  isPostLoginLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginInput) => Promise<void>;
  verifyOtp: (data: OtpInput) => Promise<void>;
  forgotPassword: (data: ForgotPasswordInput) => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateTwoFactorSettings: (settings: TwoFactorSettings) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
  updateProfile: (data: ProfileUpdateInput) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [twoFactorSettings, setTwoFactorSettings] = useState<TwoFactorSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPostLoginLoading, setIsPostLoginLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      const storedProfile = localStorage.getItem('profile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
      const storedTwoFactorSettings = localStorage.getItem('twoFactorSettings');
      if (storedTwoFactorSettings) {
        setTwoFactorSettings(JSON.parse(storedTwoFactorSettings));
      }
      setIsAuthenticated(!!localStorage.getItem('authToken'));
    } catch (err) {
      console.error('Failed to load user from localStorage:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const normalizeProfile = (data: Profile): Profile => ({
    ...data,
    avatar: data.avatar || null,
    bio: data.bio || null,
    dateOfBirth: data.dateOfBirth || null,
    age: data.age ?? null,
    gender: data.gender || null,
    bloodGroup: data.bloodGroup || null,
    address: data.address || null,
    emergencyContact: data.emergencyContact || null,
  });

  const getResponseData = <T,>(payload: unknown): T => {
    if (payload && typeof payload === 'object' && 'data' in payload) {
      return (payload as { data: T }).data;
    }
    return payload as T;
  };

  const fetchProfile = useCallback(async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/profiles/me`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile (${response.status})`);
      }

      const payload = await response.json();
      const profileData = normalizeProfile(getResponseData<Profile>(payload));

      setProfile(profileData);
      localStorage.setItem('profile', JSON.stringify(profileData));

      setUser((prev) => ({
        id: profileData.userId || profileData.id || prev?.id || '',
        email: profileData.email || prev?.email || '',
        name: profileData.userName || prev?.name || '',
        role: (profileData.role as User['role']) || prev?.role || 'user',
        isActive: prev?.isActive ?? true,
        createdAt: prev?.createdAt ?? new Date(profileData.createdAt),
        updatedAt: new Date(profileData.updatedAt),
      }));
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  }, []);

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [fetchProfile, profile]);

  const login = useCallback(async (credentials: LoginInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();
      console.log('Login response status:', result);


      if (result.requiresOtp) {
        router.push('/auth/verify-otp');

        localStorage.setItem('pendingUserId', result.userId);

      }
      else {

        console.log('token ', result?.data?.accessToken);
        if (result?.data?.accessToken) {
          localStorage.setItem('authToken', result?.data?.accessToken);
          if (result?.data?.refreshToken) {
            localStorage.setItem('refreshToken', result?.data?.refreshToken);
          }
          setIsAuthenticated(true);
          await fetchProfile();
          setIsPostLoginLoading(true);
          window.setTimeout(() => setIsPostLoginLoading(false), 2000);
          router.push('/dashboard');
        }
      }

      // if (!response.ok) {
      //   const message = typeof payload === 'string'
      //     ? payload
      //     : payload?.message || payload?.error || 'Login failed';
      //   throw new Error(message);
      // }

      // const userId = typeof payload === 'object'
      //   ? (payload as { userId?: string; user?: { id?: string } }).userId
      //   || (payload as { user?: { id?: string } }).user?.id
      //   : undefined;

      // if (!userId) {
      //   throw new Error('Missing user id for OTP verification');
      // }



      // localStorage.setItem('pendingUserId', userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }, [fetchProfile, router]);

  const verifyOtp = useCallback(async (data: OtpInput) => {
    setIsLoading(true);
    setError(null);
    try {

      console.log('Verifying OTP with data:', data);
      const response = await fetch(`${API_BASE_URL}/auth/login/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      console.log('OTP :', result.data);



      localStorage.setItem('authToken', result.data.accessToken);
      if (result.data.refreshToken) {
        localStorage.setItem('refreshToken', result.data.refreshToken);
      }
      localStorage.removeItem('pendingUserId');
      setIsAuthenticated(true);
      await fetchProfile();
      setIsPostLoginLoading(true);
      window.setTimeout(() => setIsPostLoginLoading(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message + 'safwan' : 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const contentType = response.headers.get('content-type') || '';
      const payload = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        const message = typeof payload === 'string'
          ? payload
          : payload?.message || payload?.error || 'Forgot password request failed';
        throw new Error(message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Forgot password request failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      console.log('Register with:', data);
      const mockUser: User = {
        id: '1',
        email: data.email,
        name: data.name,
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setProfile(null);
    setTwoFactorSettings(null);
    setError(null);
    localStorage.removeItem('user');
    localStorage.removeItem('profile');
    localStorage.removeItem('twoFactorSettings');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('pendingUserId');
    setIsAuthenticated(false);
  }, []);

  const updateProfile = useCallback(async (data: ProfileUpdateInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) throw new Error('No auth token found');
      if (!profile?.id) throw new Error('No profile found');

      // Filter out undefined values and validate nested objects
      const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value === undefined) return acc;

        // Validate address object - must have all required fields
        if (key === 'address' && value !== null) {
          const addr = value as any;
          if (!addr.street || !addr.city || !addr.state || !addr.country || !addr.zipCode) {
            console.warn('Incomplete address object, skipping');
            return acc;
          }
        }

        // Validate emergencyContact object - must have all required fields
        if (key === 'emergencyContact' && value !== null) {
          const contact = value as any;
          if (!contact.name || !contact.phoneNumber || !contact.relationship) {
            console.warn('Incomplete emergencyContact object (missing relationship?), skipping');
            return acc;
          }
        }

        acc[key] = value;
        return acc;
      }, {} as Record<string, any>);

      console.log('Sending profile update:', cleanedData);

      const response = await fetch(`${API_BASE_URL}/profiles/${profile.id}`, {
        method: 'PATCH',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(cleanedData),
      });

      const contentType = response.headers.get('content-type') || '';
      const payload = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

      console.log('Update profile response:', { status: response.status, payload });

      if (!response.ok) {
        const message = typeof payload === 'string'
          ? payload
          : payload?.message || payload?.error || 'Update failed';
        throw new Error(message);
      }

      const updatedProfile = normalizeProfile(payload as Profile);
      setProfile(updatedProfile);
      await fetchProfile();
      localStorage.setItem('profile', JSON.stringify(updatedProfile));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [profile, fetchProfile]);

  const updateTwoFactorSettings = useCallback(async (settings: TwoFactorSettings) => {
    // setIsLoading(true);
    setError(null);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) throw new Error('No auth token found');

      const response = await fetch(`${API_BASE_URL}/two-factor/settings`, {
        method: 'PATCH',
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(settings),
      });

      const contentType = response.headers.get('content-type') || '';
      const payload = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        const message = typeof payload === 'string'
          ? payload
          : payload?.message || payload?.error || 'Two-factor update failed';
        throw new Error(message);
      }

      const updatedSettings: TwoFactorSettings = typeof payload === 'object'
        ? {
          context: (payload as { context?: 'LOGIN' }).context || settings.context,
          enabled: (payload as { enabled?: boolean }).enabled ?? settings.enabled,
        }
        : settings;

      setTwoFactorSettings(updatedSettings);
      localStorage.setItem('twoFactorSettings', JSON.stringify(updatedSettings));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Two-factor update failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, profile, twoFactorSettings, isLoading, isPostLoginLoading, error, isAuthenticated, login, verifyOtp, forgotPassword, fetchProfile, updateTwoFactorSettings, register, logout, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
