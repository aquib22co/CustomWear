"use client";
import DesignGallery from '@/components/UploadDesigns'
import ExploreGallery from '@/components/Explore';
import { Raleway } from "next/font/google";
import AnimatedGridPattern from '@/components/ui/animated-grid-pattern';
import { cn } from "@/lib/utils";
import { Search } from 'lucide-react';
import { SignedIn } from '@clerk/nextjs';
import { FiChevronLeft } from 'react-icons/fi';
import Link from 'next/link';
//To-Do: Add a button to navigate back to the home page

const raleway = Raleway({
    subsets: ["latin"],
    weight: ["100", "400", "700"],
});

const Explore = () => {
    return (
        <div className="min-h-screen bg-black">
            {/* Background Pattern */}
            <div className="fixed inset-0 z-0">
                <AnimatedGridPattern
                    numSquares={30}
                    maxOpacity={0.1}
                    duration={3}
                    repeatDelay={1}
                    className={cn(
                        "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
                        "skew-y-12"
                    )}
                />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Search and Filter Section */}
                <div className="sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b border-gray-800 px-4 py-4">
                    <div className="flex justify-center items-center mx-auto">
                        <div className='fixed flex justify-items-center left-10 w-10 z-50'>
                            <Link
                                href="/"
                                className="text-gray-400 hover:text-gray-200 p-4 hover:bg-gray-400/20 rounded-full transition-all duration-300"
                            >
                                <FiChevronLeft size={24} />
                            </Link>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            {/* Search Bar */}
                            <div className="relative flex-1 w-full max-w-lg rounded-full mb-4">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Search designs..."
                                    className="w-full rounded-full h-12 pl-10 pr-4 bg-gray-900/50 border border-gray-700 text-white placeholder:text-gray-400 focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
                                />
                            </div>

                            {/* Filter Tags */}
                            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                                {['All Designs', 'Popular', 'Recent', 'T-Shirts', 'Hoodies', 'Custom'].map((tag) => (
                                    <button
                                        key={tag}
                                        className="px-3 py-1 text-xs rounded-full bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 transition-colors whitespace-nowrap border border-gray-700 hover:text-white hover:border-gray-500"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 py-12">
                    {/* Featured Section */}
                    <SignedIn>
                        <section className="mb-16">
                            <h2 className={`${raleway.className} text-3xl font-bold text-white mb-8`}>
                                Upload Designs
                            </h2>
                            <div className="grid grid-cols-1 gap-8">
                                <div className="bg-gray-900/40 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all">
                                    <DesignGallery />
                                </div>
                            </div>
                        </section>
                    </SignedIn>

                    {/* All Designs */}
                    <section>
                        <div className="flex justify-between items-center mb-8">
                            <h2 className={`${raleway.className} text-3xl font-bold text-white`}>
                                All Designs
                            </h2>
                            <button className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-800/50">
                                View All →
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-all">
                                <ExploreGallery />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Explore;