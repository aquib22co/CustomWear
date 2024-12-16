import React from 'react';
import { Button } from './ui/button';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { Raleway } from 'next/font/google';

const raleWay = Raleway({
    subsets: ["latin"],
    weight: ["400", "700"],
});


const NavBar = () => {
    return (
        <div className="fixed flex justify-between items-center left-0 right-0 top-0 bg-black z-50 shadow-lg backdrop-blur-md bg-black/20 border-b border-black/0">
            {/* Main NavBar Content */}
            <div className='flex'>
                <p className={`${raleWay.className} text-white text-2xl font-bold  ml-4 mr-12`}>
                    <span className='hidden md:block'>Custom Wear</span>
                </p>
                <button className='text-gray-400 hover:text-gray-200 font-normal mx-4'>Home</button>
                <button className='text-gray-400 hover:text-gray-200 font-normal mx-4'>Explore</button>
                <button className='text-gray-400 hover:text-gray-200 font-normal mx-4'>Shop</button>
                <button className='text-gray-400 hover:text-gray-200 font-normal mx-4'>About</button>
            </div>
            <div className="flex flex-col items-end justify-center">
                <div className='flex flex-col justify-center'>
                    <div>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <Button
                                    variant="default"
                                    className="bg-white rounded-full px-8 hover:bg-gray-300 border-[1px] transition-all duration-300 ease-in-out my-4 mx-2 font-bold text-gray-800"
                                >
                                    Sign In
                                </Button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <Button
                                    variant="default"
                                    className="bg-blue-400 hover:bg-blue-600 rounded-full px-8 my-4 mr-2 font-bold"
                                >
                                    Sign Up
                                </Button>
                            </SignUpButton>
                        </SignedOut>

                    </div>
                    <SignedIn>
                        <div className="my-2 mx-2 flex ">
                            <Button
                                variant="default"
                                className="bg-slate-400 hover:bg-slate-600 rounded-full px-8 my-4 mr-2 font-bold"
                            >
                                Dashboard
                            </Button>
                            <UserButton
                                appearance={{
                                    elements: {
                                        rootBox: {
                                            fontSize: '16px',
                                            borderRadius: '8px',
                                        },
                                        userButtonAvatarBox: {
                                            width: '36px',
                                            height: '36px',
                                        },
                                    },
                                }}
                            />
                        </div>
                    </SignedIn>
                </div>
            </div>

            {/* Fading Bottom Border */}
            <div className="absolute bottom-0 left-0 w-full h-[0.5px] bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
        </div>
    );
};

export default NavBar;
