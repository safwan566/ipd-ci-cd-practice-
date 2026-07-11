'use client';

import React, { useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ImageUploadFieldProps {
  label?: string;
  value?: string | null;
  onChange: (url: string | null) => void;
  required?: boolean;
  requiredMessage?: string;
  helperText?: string;
  disabled?: boolean;
  forceError?: boolean;
}

export function ImageUploadField({
  label = 'Upload Image',
  value,
  onChange,
  required = false,
  requiredMessage = 'Image is required',
  helperText,
  disabled = false,
  forceError = false,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setTouched(true);
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are allowed.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        headers: {
          accept: '*/*',
        },
        body: formData,
      });

      const contentType = response.headers.get('content-type') || '';
      const payload = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        const message = typeof payload === 'string'
          ? payload
          : payload?.message || payload?.error || 'Image upload failed';
        throw new Error(message);
      }

      const imageUrl = typeof payload === 'string'
        ? payload
        : payload?.url || payload?.imageUrl || payload?.data?.url;

      if (!imageUrl) {
        throw new Error('Upload succeeded but no image URL returned');
      }

      onChange(imageUrl);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const showRequiredError = required && !value && (touched || forceError);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-600"> *</span>}
        </label>
        {value && !disabled && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs font-semibold text-red-600 hover:text-red-700"
          >
            Remove
          </button>
        )}
      </div>

      {value && (
        <div className="flex items-center gap-4">
          <img
            src={value}
            alt="Uploaded preview"
            className="w-16 h-16 rounded-lg border border-gray-200 object-cover"
          />
          <p className="text-xs text-gray-500 break-all">{value}</p>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        onBlur={() => setTouched(true)}
        disabled={disabled || isUploading}
        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
      />

      {helperText && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}

      {uploadError && (
        <p className="text-xs text-red-600">{uploadError}</p>
      )}

      {showRequiredError && !uploadError && (
        <p className="text-xs text-red-600">{requiredMessage}</p>
      )}

      {isUploading && (
        <p className="text-xs text-gray-500">Uploading image...</p>
      )}
    </div>
  );
}
