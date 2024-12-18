'use client';

import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

const DashboardButton = () => {
    const { user } = useUser();

    if (!user) return null;

    return (
        <Link
            href={`/dashboard/${user.id}`}
            className="text-gray-200 py-[6px] bg-slate-600 hover:bg-slate-800 border-[0.5px] border-gray-500 rounded-full px-8 my-4 mr-2 font-bold"
        >
            Dashboard
        </Link>
    );
};

export default DashboardButton;
