'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Camera, User as  Calendar, Save, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function ProfilePage() {
  const { user, profile, twoFactorSettings, updateTwoFactorSettings, updateProfile, isLoading } = useUser();

  console.log('profile ', profile);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    avatar: profile?.avatar || '',
    bio: profile?.bio || '',
    dateOfBirth: profile?.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : '',
    gender: profile?.gender || '',
    bloodGroup: profile?.bloodGroup || '',
    address: {
      street: profile?.address?.street || '',
      city: profile?.address?.city || '',
      state: profile?.address?.state || '',
      country: profile?.address?.country || '',
      zipCode: profile?.address?.zipCode || '',
    },
    emergencyContact: {
      name: profile?.emergencyContact?.name || '',
      phoneNumber: profile?.emergencyContact?.phoneNumber || '',
    },
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(twoFactorSettings?.enabled ?? false);

  useEffect(() => {
    setFormData({
      avatar: profile?.avatar || '',
      bio: profile?.bio || '',
      dateOfBirth: profile?.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : '',
      gender: profile?.gender || '',
      bloodGroup: profile?.bloodGroup || '',
      address: {
        street: profile?.address?.street || '',
        city: profile?.address?.city || '',
        state: profile?.address?.state || '',
        country: profile?.address?.country || '',
        zipCode: profile?.address?.zipCode || '',
      },
      emergencyContact: {
        name: profile?.emergencyContact?.name || '',
        phoneNumber: profile?.emergencyContact?.phoneNumber || '',
      },
    });
  }, [profile]);

  useEffect(() => {
    if (twoFactorSettings) {
      setIsTwoFactorEnabled(twoFactorSettings.enabled);
    }
  }, [twoFactorSettings]);

  const toggleEdit = () => {
    setIsEditing(prev => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleEmergencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      emergencyContact: {
        ...formData.emergencyContact,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // const reader = new FileReader();
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post(`http://localhost:5000/api/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', res.data.imageUrl);
      if (res.data.imageUrl) {
        setFormData(prev => ({
          ...prev,
          avatar: res.data.imageUrl
        }));
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const hasAddress = Object.values(formData.address).some((value) => value.trim());
      const hasEmergency = Object.values(formData.emergencyContact).some((value) => value.trim());

      await updateProfile({
        avatar: formData.avatar.trim() || null,
        bio: formData.bio.trim() || null,
        dateOfBirth: formData.dateOfBirth || null,
        gender: formData.gender || null,
        bloodGroup: formData.bloodGroup || null,
        address: hasAddress ? formData.address : null,
        emergencyContact: hasEmergency ? formData.emergencyContact : null,
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    }
  };

  const handleCancel = () => {
    setFormData({
      avatar: profile?.avatar || '',
      bio: profile?.bio || '',
      dateOfBirth: profile?.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : '',
      gender: profile?.gender || '',
      bloodGroup: profile?.bloodGroup || '',
      address: {
        street: profile?.address?.street || '',
        city: profile?.address?.city || '',
        state: profile?.address?.state || '',
        country: profile?.address?.country || '',
        zipCode: profile?.address?.zipCode || '',
      },
      emergencyContact: {
        name: profile?.emergencyContact?.name || '',
        phoneNumber: profile?.emergencyContact?.phoneNumber || '',
      },
    });
    setIsEditing(false);
    setMessage(null);
  };

  const handleTwoFactorToggle = async () => {
    const nextValue = !isTwoFactorEnabled;
    setIsTwoFactorEnabled(nextValue);
    try {
      await updateTwoFactorSettings({
        context: 'LOGIN',
        enabled: nextValue,
      });
      setMessage({ type: 'success', text: `Two-factor authentication ${nextValue ? 'enabled' : 'disabled'}.` });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setIsTwoFactorEnabled(!nextValue);
      setMessage({ type: 'error', text: 'Failed to update two-factor settings.' });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your personal information and account settings</p>
      </div>

      {message && (
        <div className={`mb-6 flex items-center gap-3 p-4 rounded-lg border ${message.type === 'success'
          ? 'bg-green-50 border-green-200 text-green-800'
          : 'bg-red-50 border-red-200 text-red-800'
          }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-secondary to-green-600 px-8 py-12 relative">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-secondary shadow-lg overflow-hidden">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="User avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0) || 'U'
                )}
              </div>

              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

              {isEditing && (
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                >
                  <Camera className="w-5 h-5 text-gray-700" />
                </button>
              )}
            </div>

            <div className="text-center md:text-left text-white">
              <h2 className="text-3xl font-bold mb-1">{profile?.userName || 'User'}</h2>
              <p className="text-green-100 text-lg capitalize">{profile?.role || 'Member'}</p>
              <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                <Calendar className="w-4 h-4" />
                <p className="text-sm text-green-100">
                  Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-gray-200 flex justify-between">
          <h3 className="font-semibold text-gray-900">Profile Information</h3>
          <button
            type="button"
            onClick={toggleEdit}
            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-green-600 font-semibold text-sm"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                rows={3}
                className={`w-full px-4 py-3 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'}`}
                placeholder="Share a short bio"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'}`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'}`}
                >
                  <option value="">Select</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Group</label>
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'}`}
                >
                  <option value="">Select</option>
                  <option value="A_POSITIVE">A+</option>
                  <option value="A_NEGATIVE">A-</option>
                  <option value="B_POSITIVE">B+</option>
                  <option value="B_NEGATIVE">B-</option>
                  <option value="AB_POSITIVE">AB+</option>
                  <option value="AB_NEGATIVE">AB-</option>
                  <option value="O_POSITIVE">O+</option>
                  <option value="O_NEGATIVE">O-</option>
                </select>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['street', 'city', 'state', 'country', 'zipCode'].map((field) => (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={(formData.address as Record<string, string>)[field]}
                    onChange={handleAddressChange}
                    disabled={!isEditing}
                    className={`px-4 py-3 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['name', 'phoneNumber'].map((field) => (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={(formData.emergencyContact as Record<string, string>)[field]}
                    onChange={handleEmergencyChange}
                    disabled={!isEditing}
                    className={`px-4 py-3 rounded-lg border ${isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'}`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Account Status</label>
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700">{user?.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Two-Factor Auth</label>
                <button
                  type="button"
                  onClick={handleTwoFactorToggle}
                  disabled={isLoading}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${isTwoFactorEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isTwoFactorEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-secondary text-white font-semibold py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Save className="w-5 h-5" /> Save Changes</>}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}