'use client';

import { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';

const DesignGallery = () => {
  const [designs, setDesigns] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const response = await fetch('/api/explore');
      if (!response.ok) throw new Error('Failed to fetch designs');
      const data = await response.json();
      setDesigns(data);
    } catch (error) {
      setError('Failed to load designs');
      console.error('Error:', error);
    }
  };

  const handleUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      setIsUploading(true);
      setError('');

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/explore', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();
      setDesigns(prev => [...prev, result]);
      
    } catch (error) {
      setError('Failed to upload design');
      console.error('Error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <input
          type="file"
          id="design-upload"
          className="hidden"
          accept="image/*"
          onChange={handleUpload}
        />
        <label 
          htmlFor="design-upload"
          className={`inline-flex items-center px-4 py-2 rounded-md border border-gray-300 
            bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload Design'}
        </label>
        {error && (
          <div className="mt-2 text-red-500 flex items-center gap-2">
            <X className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {designs.map((design) => (
          <div 
            key={design.public_id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="p-4">
              <div className="relative aspect-square">
                <img
                  src={design.secure_url}
                  alt={`Design ${design.public_id}`}
                  className="object-cover rounded-lg w-full h-full"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DesignGallery;
