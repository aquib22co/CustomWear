"use client";
import { useUser } from '@clerk/nextjs';
import Navbar from '@/components/dashboard/Navbar'
import SideBar from '@/components/dashboard/SideBar'
import React from 'react'


const Editor = () => {
    const { user } = useUser();
    return (
        <div>
            <Navbar title="Editor" />
            {user && <SideBar userId={user.id} />}
            <div className="content">

            </div>
        </div>
    )
}

export default Editor