'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface UploadResponse {
  success: boolean;
  data: {
    _id: string;
    drawing_pic: string;
    drawing_name: string;
  };
}

//Todo : Only Uploads the image when the user is logged in

export default function DrawingUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];

    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) return;

    if (!title) {
      setError('Please enter a title');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('drawing_pic', selectedFile);
    formData.append('drawing_name', title);
    formData.append('drawing_on', 'canvas'); // or any other surface

    try {
      const response = await fetch('http://localhost:3000/api/explore', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data: UploadResponse = await response.json();

      // Reset form after successful upload
      setSelectedFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // You can handle success here (e.g., show success message, redirect, etc.)
      console.log('Upload successful:', data);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file) {
      // Trigger the same validation and preview logic
      const changeEvent = {
        target: {
          files: [file]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(changeEvent);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
          id="file-upload"
        />

        {!preview ? (
          <label
            htmlFor="file-upload"
            className="cursor-pointer block"
          >
            <div className="space-y-2">
              <div className="text-gray-600">
                Drag and drop an image here, or click to select
              </div>
              <div className="text-sm text-gray-500">
                PNG, JPG up to 5MB
              </div>
            </div>
          </label>
        ) : (
          <div className="space-y-4">
            <div className="relative w-full h-48">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <button
              onClick={() => {
                setSelectedFile(null);
                setPreview(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="text-red-500 text-sm hover:text-red-600"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 text-red-500 text-sm">
          {error}
        </div>
      )}
      <input type="text" placeholder="Title" className="w-full mt-4 py-2 px-4 rounded-xl text-white bg-gray-900/50 border border-gray-700 placeholder:text-gray-400 focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600" onChange={(e) => setTitle(e.target.value)} />
      <button
        onClick={handleUpload}
        disabled={!selectedFile || isLoading}
        className={`mt-4 w-full py-2 px-4 rounded-full text-white ${!selectedFile || isLoading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600'
          }`}
      >
        {isLoading ? 'Uploading...' : 'Upload Drawing'}
      </button>
    </div>
  );
}