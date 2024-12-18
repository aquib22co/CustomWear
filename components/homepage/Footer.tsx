import { Raleway } from 'next/font/google';
import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const raleWay = Raleway({
    subsets: ["latin"],
    weight: ["100", "400", "700"],
});


const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    {/* Logo and Company Info */}
                    <div className="text-center md:text-left mb-6 md:mb-0">
                        <h2 className={`${raleWay.className} font-bold text-3xl pb-8 text-transparent bg-gradient-to-b from-white to-gray-800 bg-clip-text`}>CustomWear</h2>
                        <p className="text-lg text-gray-400">Your one-stop destination for personalized clothing.</p>
                        <p className="text-gray-400 mt-4">© 2024 CustomWear. All Rights Reserved.</p>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-col md:flex-row gap-6 mb-6 md:mb-0">
                        <a href="/about" className="text-lg text-gray-300 hover:text-indigo-500">About Us</a>
                        <a href="/shop" className="text-lg text-gray-300 hover:text-indigo-500">Shop</a>
                        <a href="/contact" className="text-lg text-gray-300 hover:text-indigo-500">Contact</a>
                        <a href="/faq" className="text-lg text-gray-300 hover:text-indigo-500">FAQ</a>
                    </div>

                    {/* Social Media Icons */}
                    <div className="flex justify-center md:justify-start gap-6">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-600">
                            <FaFacebookF className="text-2xl" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-pink-600">
                            <FaInstagram className="text-2xl" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400">
                            <FaTwitter className="text-2xl" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-700">
                            <FaLinkedinIn className="text-2xl" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
