import React from 'react'
import { Button } from './ui/button'

const NavBar = () => {
    return (
        <div className='h-[70px] bg-black'>
            <div className='absolute right-0'>
                <Button className='mx-2 my-4 bg-white rounded-3xl hover:bg-slate-400'>Sign In</Button>
                <Button className='mx-2 my-4 bg-blue-500 rounded-3xl hover:bg-blue-700'>Sign Up</Button>
            </div>
        </div >
    )
}

export default NavBar