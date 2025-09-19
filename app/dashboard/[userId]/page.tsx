'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { X } from "lucide-react"
import { useUser } from '@clerk/nextjs';
import Navbar from '@/components/dashboard/Navbar';
import SideBar from '@/components/dashboard/SideBar';

// Define the type for a drawing
interface Drawing {
    _id: string;
    drawing_pic: string;
}

const Dashboard = () => {
    const [drawings, setDrawings] = useState<Drawing[]>([]); // Explicitly type the state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null); // Track selected drawing
    const params = useParams(); // Fetch params object
    const { user } = useUser(); // Clerk user object

    // Extract userId from params
    const userId = params?.userId;

    // Fetch drawings function
    const fetchDrawings = async () => {
      try {
        const response = await fetch('/api/editor', {
          method: 'GET',
          credentials: 'include',
        });
    
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          throw new Error(errorData.message || 'Failed to fetch drawings');
        }
    
        const data: { data: Drawing[] } = await response.json(); 
        setDrawings(data.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred.');
          console.error('Unexpected error type:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
        if (user && user.id === userId) {
            fetchDrawings();
        }
    }, []); // Include dependencies to avoid stale values

    // Conditional rendering for loading, access denial, or error
    if (!user) {
        return <div>Loading...</div>;
    }

    if (user.id !== userId) {
        return <div>Access Denied</div>;
    }

    if (loading) return <div>Loading your designs...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <Navbar title={user.fullName} />
            <SideBar userId={user.id} />
            <div className="content">
                <h1 className="text-4xl text-white font-bold">Welcome, {user.firstName}</h1>
                <p className="mt-4 text-gray-500">This is your personal Designs!</p>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-8">
                    {drawings.map((drawing) => (
                        <div
                            key={drawing._id}
                            className="card-bg rounded shadow-lg p-4 h-56 flex items-center justify-center transition-transform duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                            onClick={() => setSelectedDrawing(drawing)} // Open modal with selected drawing
                        >
                            <img
                                src={drawing.drawing_pic}
                                alt="User Drawing"
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {selectedDrawing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out opacity-100">
                    <div className="content-bg rounded w-96 p-6 relative transform transition-transform duration-300 ease-in-out scale-100">
                        <button
                            className="absolute top-2 right-2 text-red-800 p-1 hover:text-red-950 transition-all ease-in-out duration-300"
                            onClick={() => setSelectedDrawing(null)} // Close modal
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-xl text-white font-semibold mb-4">Sell Your Product</h2>
                        <div className="mb-4">
                            <img
                                src={selectedDrawing.drawing_pic}
                                alt="Selected Drawing"
                                className="w-full h-48 object-contain rounded"
                            />
                        </div>
                        <form>
                            <div className="mb-4">
                                <label htmlFor="productType" className="block text-sm font-medium text-gray-400">
                                    Product Type
                                </label>
                                <select
                                    id="productType"
                                    className="card-bg mt-1 text-white block w-full border rounded shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                >
                                    <option value="hoodie">Hoodie</option>
                                    <option value="tshirt">T-shirt</option>
                                    <option value="collared-tshirt">Collared T-shirt</option>
                                    <option value="sweatshirt">Sweatshirt</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-400">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    className="card-bg text-white mt-1 block w-full border rounded shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    placeholder="Enter product price"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
