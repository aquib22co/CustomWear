'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { Raleway } from 'next/font/google';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '@clerk/nextjs';
import DashboardButton from './homepage/DashboardButton';

const raleWay = Raleway({
    subsets: ['latin'],
    weight: ['400', '700'],
});

const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { userId, sessionId, isLoaded } = useAuth();
    console.log(`User ID: ${userId}, Session ID: ${sessionId}, isLoaded: ${isLoaded}`);

    useEffect(() => {
        const fetchAuth = async () => {
            try {
                if (sessionId) {
                    const response = await fetch('/api/auth', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ sessionId: sessionId })
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    console.log(data); // Handle the data as required
                }
            } catch (error) {
                console.log('Error during authentication request:', error);
            }
        };

        fetchAuth();
    }, [sessionId]);


    return (
        <div className="fixed top-0 left-0 right-0 bg-black/20 z-50 shadow-lg backdrop-blur-md border-b border-transparent">
            {/* Main Navigation Container */}
            <div className="flex justify-between items-center px-6 md:px-12 py-4">
                {/* Logo */}
                <p
                    className={`${raleWay.className} text-transparent bg-gradient-to-b from-white to-gray-600 bg-clip-text text-3xl font-bold`}
                >
                    Custom Wear
                </p>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link
                        href="/"
                        className="text-gray-400 hover:text-gray-200 hover:bg-gray-400/20 px-6 py-2 rounded-full transition-all duration-300"
                    >
                        Home
                    </Link>
                    <Link
                        href="/explore"
                        className="text-gray-400 hover:text-gray-200 hover:bg-gray-400/20 px-6 py-2 rounded-full transition-all duration-300"
                    >
                        Explore
                    </Link>
                    <Link
                        href="/shop"
                        className="text-gray-400 hover:text-gray-200 hover:bg-gray-400/20 px-6 py-2 rounded-full transition-all duration-300"
                    >
                        Shop
                    </Link>
                    <Link
                        href="/about"
                        className="text-gray-400 hover:text-gray-200 hover:bg-gray-400/20 px-6 py-2 rounded-full transition-all duration-300"
                    >
                        About
                    </Link>
                </div>

                {/* SignIn/SignOut Buttons */}
                <div className="hidden md:flex items-center space-x-4">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button className="bg-white text-gray-800 px-6 py-2 rounded-full font-semibold hover:bg-gray-300 transition-all duration-300">
                                Sign In
                            </Button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <Button className="bg-gradient-to-r from-gray-800 to-slate-700 hover:from-gray-900 hover:to-slate-800 text-white px-6 py-2 rounded-full border border-gray-500 font-semibold transition-all duration-300">
                                Sign Up
                            </Button>
                        </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                        <div className="flex items-center space-x-4">
                            <DashboardButton />
                            <UserButton />
                        </div>
                    </SignedIn>
                </div>

                {/* Hamburger Menu Icon */}
                <button
                    className="md:hidden text-gray-300 hover:text-gray-100 transition-all duration-300"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-black/95 backdrop-blur-md text-center py-6 space-y-4">
                    <Link
                        href="/"
                        className="block text-gray-300 hover:text-gray-200 hover:bg-gray-400/20 px-6 py-2 rounded-full transition-all duration-300"
                        onClick={() => setMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        href="/explore"
                        className="block text-gray-300 hover:text-gray-200 hover:bg-gray-400/20 px-6 py-2 rounded-full transition-all duration-300"
                        onClick={() => setMenuOpen(false)}
                    >
                        Explore
                    </Link>
                    <Link
                        href="/shop"
                        className="block text-gray-300 hover:text-gray-200 hover:bg-gray-400/20 px-6 py-2 rounded-full transition-all duration-300"
                        onClick={() => setMenuOpen(false)}
                    >
                        Shop
                    </Link>
                    <Link
                        href="/about"
                        className="block text-gray-300 hover:text-gray-200 hover:bg-gray-400/20 px-6 py-2 rounded-full transition-all duration-300"
                        onClick={() => setMenuOpen(false)}
                    >
                        About
                    </Link>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button className="w-full bg-white text-gray-800 py-2 rounded-full font-semibold hover:bg-gray-300 transition-all duration-300">
                                Sign In
                            </Button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <Button className="w-full bg-gradient-to-r from-gray-800 to-slate-700 hover:from-gray-900 hover:to-slate-800 text-white py-2 rounded-full border border-gray-500 font-semibold transition-all duration-300">
                                Sign Up
                            </Button>
                        </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                        <div className="flex justify-center items-center space-x-4">
                            <DashboardButton />
                            <UserButton />
                        </div>
                    </SignedIn>
                </div>
            )}

            {/* Bottom Gradient Border */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
        </div>
    );
};

export default NavBar;
