
import NavBar from '@/components/NavBar'
import React from 'react'
import connectDB from '@/lib/db'
import HeroSection from '@/components/homepage/HeroSection';
import NextSection from '@/components/homepage/NextSection';
import CanvasSection from '@/components/homepage/CanvasSection';
import ShinyBorderSection from '@/components/homepage/ShinyBorderSection';
import Footer from '@/components/homepage/Footer';

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
      <CanvasSection />
      <ShinyBorderSection />
      <Footer />
    </div>
  )
}

export default page