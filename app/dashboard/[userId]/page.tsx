'use client';

import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Navbar from '@/components/dashboard/Navbar';
import SideBar from '@/components/dashboard/SideBar';

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
            <Navbar title={user.fullName} />
            <SideBar userId={user.id} />
            <div className="content">
                <h1 className="text-4xl text-white font-bold">Welcome, {user.firstName}</h1>
                <p className="mt-4 text-gray-500">This is your personal Designs!</p>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-8">
                    <div className="card-bg rounded shadow-lg p-4 h-56 flex items-center justify-center transition-transform duration-300 ease-in-out transform hover:scale-105">
                        <span className="text-gray-200">Placeholder</span>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Dashboard;
