'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Drawing {
  _id: string;
  drawing_name: string;
  drawing_pic: string;
  drawing_on: string;
  createdAt: string;
  createdBy?: {
    name: string;
    email: string;
  };
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalDrawings: number;
}

export default function ExploreGallery() {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalDrawings: 0,
  });

  const fetchDrawings = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/explore?page=${page}&limit=12`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error fetching drawings');
      }

      setDrawings(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch drawings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrawings();
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchDrawings(newPage);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Drawing Gallery</h2>
      
      {/* Grid of drawings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {drawings.map((drawing) => (
          <div 
            key={drawing._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative h-48">
              <Image
                src={drawing.drawing_pic}
                alt={drawing.drawing_name}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">
                {drawing.drawing_name}
              </h3>
              
              <div className="text-sm text-gray-600">
                <p>Created on: {new Date(drawing.createdAt).toLocaleDateString()}</p>
                {drawing.createdBy && (
                  <p>By: {drawing.createdBy.name}</p>
                )}
                <p>Surface: {drawing.drawing_on}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>
          
          <span className="px-4 py-2">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}