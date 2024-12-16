
import Image from "next/image";
import CS2 from "../../app/assets/CustomWear2.png";

const NextSection = () => {
    return (
        <section className="bg-black text-white py-16">
            <h2 className="text-4xl font-extrabold text-center mb-[100px]">Why Choose Custom Wear?</h2>
            <div className="flex flex-col sm:flex-row justify-center items-center max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-rows-1 sm:grid-rows-2 lg:grid-rows-3 gap-8 m-8">
                    <div className="bg-gradient-to-r from-gray-950 to-gray-900 p-8 rounded-2xl border-[0.1px] border-gray-500 shadow-lg hover:shadow-xl transition-all duration-300">
                        <h3 className="text-2xl font-semibold mb-4">Unique Designs</h3>
                        <p>Customize your own T-shirts with endless possibilities. Be creative and design exactly what you want.</p>
                    </div>
                    <div className="bg-gradient-to-r from-gray-950 to-gray-900 p-8 rounded-2xl border-[0.1px] border-gray-500 shadow-lg hover:shadow-xl transition-all duration-300">
                        <h3 className="text-2xl font-semibold mb-4">Quality Materials</h3>
                        <p>We use the finest fabrics to ensure your custom T-shirts are comfortable and durable.</p>
                    </div>
                    <div className="bg-gradient-to-r from-gray-950 to-gray-900 p-8 rounded-2xl border-[0.1px] border-gray-500 shadow-lg hover:shadow-xl transition-all duration-300">
                        <h3 className="text-2xl font-semibold mb-4">Fast Shipping</h3>
                        <p>Get your custom T-shirt delivered quickly with our efficient shipping process.</p>
                    </div>
                </div>
                <div className="m-16">
                    <Image src={CS2} height={400} width={400} alt="logo" />
                </div>
            </div>
        </section>
    );
};

export default NextSection;
