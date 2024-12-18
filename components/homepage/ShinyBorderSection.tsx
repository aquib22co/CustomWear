import React from 'react';
import { BorderBeam } from '../ui/border-beam'; // Assuming BorderBeam is a custom component for your border effect
import { FaShoppingCart, FaTshirt, FaShippingFast, FaCreditCard } from 'react-icons/fa'; // Shopping-related icons
import { Raleway } from 'next/font/google';


const raleWay = Raleway({
    subsets: ["latin"],
    weight: ["100", "400", "700"],
});

const ShinyBorderSection = () => {
    return (
        <div className="w-full h-auto bg-black flex items-center justify-center">
            <div className="relative mb-32 mt-10 flex flex-col items-center justify-center w-full max-w-6xl px-24 py-12 rounded-3xl border-[1px] border-gray-500 bg-gradient-to-t from-gray-950 to-gray-800 md:shadow-xl overflow-hidden">
                {/* Shiny border animation */}
                <BorderBeam size={250} duration={12} delay={9} />
                <div className="text-center mt-8 text-white">
                    <p className={`${raleWay.className} font-bold text-7xl text-transparent bg-gradient-to-b from-white to-gray-800 bg-clip-text m-4 mb-12`}>Start Your Shopping Journey</p>


                    {/* Shopping Features with Icons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        <div className="flex flex-col items-center text-center m-4">
                            <FaShoppingCart className="text-6xl mb-4 text-gray-400" />
                            <h3 className="text-xl font-semibold">Easy Shopping</h3>
                            <p className="text-gray-300">Shop custom T-shirts with ease using our simple interface.</p>
                        </div>
                        <div className="flex flex-col items-center text-center m-4">
                            <FaTshirt className="text-6xl mb-4 text-gray-400" />
                            <h3 className="text-xl font-semibold">Design Your Own</h3>
                            <p className="text-gray-300">Create personalized designs for your T-shirt and more.</p>
                        </div>
                        <div className="flex flex-col items-center text-center m-4">
                            <FaShippingFast className="text-6xl mb-4 text-gray-400" />
                            <h3 className="text-xl font-semibold">Fast Shipping</h3>
                            <p className="text-gray-300">Receive your orders quickly and efficiently.</p>
                        </div>
                        <div className="flex flex-col items-center text-center m-4">
                            <FaCreditCard className="text-6xl mb-4 text-gray-400" />
                            <h3 className="text-xl font-semibold">Secure Payments</h3>
                            <p className="text-gray-300">Pay safely and securely through various payment methods.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShinyBorderSection;
