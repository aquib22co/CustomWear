import NavBar from '@/components/NavBar'
import React from 'react'
import connectDB from '@/lib/db'

const page = () => {
  try {
    connectDB();
  } catch (error) {
    console.error(error)
  }
  return (
    <div>
      <NavBar />
    </div>
  )
}

export default page