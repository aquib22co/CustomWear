'use client';

import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Navbar from '@/components/dashboard/Navbar';

const Dashboard = () => {
    const { userId } = useParams(); // Get dynamic userId from URL
    const { user } = useUser(); // Clerk user object

    if (!user) return <div>Loading...</div>;

    // Check if the user ID matches the logged-in user
    if (user.id !== userId) {
        return <div>Access Denied</div>;
    }

    return (
        <div>
            <Navbar />
            <div className="text-center mt-20">
                <h1 className="text-4xl text-white font-bold">Welcome, {user.firstName}</h1>
                <p className="mt-4 text-gray-500">This is your personal dashboard!</p>
            </div>
        </div>

    );
};

export default Dashboard;
