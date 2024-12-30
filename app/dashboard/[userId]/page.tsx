'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
                throw new Error('Failed to fetch drawings');
            }

            const data = await response.json();
            setDrawings(data.data); // TypeScript now knows `data.data` is of type `Drawing[]`
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.id === userId) {
            fetchDrawings();
        }
    }, [user, userId]); // Include dependencies to avoid stale values

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
                        <div key={drawing._id} className="card-bg rounded shadow-lg p-4 h-56 flex items-center justify-center transition-transform duration-300 ease-in-out transform hover:scale-105">
                            <img
                                src={drawing.drawing_pic}
                                alt="User Drawing"
                                className="w-full h-auto"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
