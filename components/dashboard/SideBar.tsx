// Code to display the sidebar of the dashboard page
"use client";
import Link from "next/link";
import { useState } from 'react';
import { FiMenu, FiChevronLeft } from 'react-icons/fi';

const buttonClasses = "flex items-center mb-4 py-2 px-20 rounded transition duration-300 ease-in-out transform hover:bg-gray-700 hover:scale-105";

const SideBar = ({ userId }: { userId: string | null | undefined }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`h-screen fixed left-0 z-10 bg-black text-white border-r border-gray-700 ${isOpen ? 'w-64' : 'w-16'} transition-width duration-300 ease-in-out`}>
            <div className="flex flex-col items-center py-4">
                <button
                    className="mb-8 py-2 px-4 rounded transition duration-300 ease-in-out transform hover:bg-gray-700 hover:scale-105"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FiChevronLeft size={24} /> : <FiMenu size={24} />}
                </button>
                {isOpen && (
                    <>
                        <Link href={`/dashboard/${userId}`}>
                            <button className={buttonClasses}>
                                <span>Home</span>
                            </button>
                        </Link>
                        <Link href={`/dashboard/${userId}/editor`}>
                            <button className={buttonClasses}>
                                <span>Editor</span>
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default SideBar;
