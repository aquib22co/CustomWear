
import NavBar from '@/components/NavBar'
import React from 'react'
import connectDB from '@/lib/db'
import HeroSection from '@/components/homepage/HeroSection';
import NextSection from '@/components/homepage/NextSection';

const page = () => {
  try {
    connectDB();
  } catch (error) {
    console.error(error)
  }
  return (
    <div>
      <NavBar />
      <HeroSection />
      <NextSection />
    </div>
  )
}

export default page