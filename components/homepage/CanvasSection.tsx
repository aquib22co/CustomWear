import Image from "next/image";
import canva from "../../app/assets/Group 1.png";
import React from "react";
import { Raleway } from "next/font/google";

const raleWay = Raleway({
    subsets: ["latin"],
    weight: ["100", "400", "700"],
});


const CanvasSection = () => {
    return (
        <div className="bg-black text-white py-16">
            <div className="flex flex-col justify-center items-center">
                {/* Left Content: Text and Features */}
                <div className="m-8">
                    <p className={`${raleWay.className} font-bold text-7xl text-transparent bg-gradient-to-b from-white to-gray-800 bg-clip-text`}>Design Your Own Clothes: Unleash Your Creativity</p>
                </div>
                <div className="flex flex-col sm:flex-row justify-center items-center my-8">
                    {/* Feature Blocks */}
                    <div className="space-y-8 m-8 ml-16">
                        <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-xl shadow-xl flex items-center justify-center w-16 h-16">
                                {/* You can add icons here */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-10 h-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v20m10-10H2" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold">Interactive Interface</h4>
                                <p className="text-lg">Simple drag-and-drop functionality that makes designing your T-shirt easy and fun.</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-xl shadow-xl flex items-center justify-center w-16 h-16">
                                {/* You can add icons here */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-10 h-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 12h2m-2 4h2m-2 4h2M4 6h16" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold">Design Tools</h4>
                                <p className="text-lg">From adding text to uploading your artwork, our canvas gives you all the tools you need to personalize every detail.</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-xl shadow-xl flex items-center justify-center w-16 h-16">
                                {/* You can add icons here */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-10 h-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v18M3 12h18" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold">Real-Time Preview</h4>
                                <p className="text-lg">See your design come to life on the T-shirt in real-time, so you can perfect every inch before ordering.</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-xl shadow-xl flex items-center justify-center w-16 h-16">
                                {/* You can add icons here */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-10 h-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold">Multiple Color Options</h4>
                                <p className="text-lg">Choose from a wide variety of T-shirt colors and patterns to enhance your design.</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-xl shadow-xl flex items-center justify-center w-16 h-16">
                                {/* You can add icons here */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-10 h-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h5l4 5 4-5h5" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold">Save and Edit</h4>
                                <p className="text-lg">Start designing and come back later to finish or modify your work at any time.</p>
                            </div>
                        </div>
                    </div>
                    {/* Right Content: Image */}
                    <div className="relative m-0">
                        <Image
                            src={canva} // Replace with the path to your image
                            alt="Canvas Design"
                            height={1518 / 2}
                            width={2281 / 2}
                            quality={100}
                            className="rounded-lg shadow-2xl"
                        />
                    </div>
                </div>


            </div>
        </div >
    );
};

export default CanvasSection;
