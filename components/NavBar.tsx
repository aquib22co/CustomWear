import React from 'react'
import { Button } from './ui/button'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

const NavBar = () => {


    return (
        <div className='bg-black'>
            <div className='flex flex-col items-end justify-center'>
                <div>
                    <SignedOut>
                        <SignInButton mode='modal'><Button variant="default" className='bg-white rounded-full my-4 mx-2 font-bold text-gray-800'>Sign In</Button></SignInButton>
                        <SignUpButton mode='modal'><Button variant="default" className='bg-blue-500 rounded-full my-4 mr-2 font-bold'>Sign Up</Button></SignUpButton>
                    </SignedOut>
                    <SignedIn>
                        <div className='my-2 mx-2'>
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
        </div >
    )
}

export default NavBar