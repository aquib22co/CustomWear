import { Raleway } from "next/font/google";
import { cn } from "@/lib/utils";
import AnimatedGridPattern from "../ui/animated-grid-pattern";
import { Button } from "../ui/button";

const raleWay = Raleway({
    subsets: ["latin"],
    weight: ["100", "400", "700"],
});


const HeroSection = () => {
    return (
        <div className="relative h-screen top-0 flex items-center justify-center overflow-hidden bg-black">
            <div className="absolute inset-0 h-full w-full z-0">
                <AnimatedGridPattern
                    numSquares={30}
                    maxOpacity={0.1}
                    duration={3}
                    repeatDelay={1}
                    className={cn(
                        "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
                        "skew-y-12",
                    )}
                />
            </div>

            {/*           
            <div className="relative z-10">
                <Image
                    src={CS2}
                    height={400} // Adjust the height to fit your design
                    width={400} // Adjust the width to fit your design
                    alt="logo"
                    className="mx-auto"
                />
            </div> */}

            {/* Text Content */}
            <div className="absolute z-20 text-center">
                <p className={`${raleWay.className} font-bold text-[100px] text-transparent bg-gradient-to-b from-white to-gray-800 bg-clip-text`}>
                    Custom Wear
                </p>
                <p className={`${raleWay.className} font-thin text-3xl text-white`}>
                    Design Your Style, Wear Your Vision.
                </p>
                <Button className="text-white rounded font-bold px-12 mt-8 py-4 bg-gradient-to-r from-gray-700 to-slate-400 hover:from-gray-800 hover:to-slate-500 transition-all duration-300 ease-in-out border-[1px]">Explore</Button>
            </div>
        </div>
    );
};

export default HeroSection;
