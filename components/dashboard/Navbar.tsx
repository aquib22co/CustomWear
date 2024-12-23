import { UserButton } from '@clerk/nextjs';
import { FaUndo, FaRedo } from 'react-icons/fa';

const Navbar = ({ title }: { title: string | null }) => {
    return (
        <nav className="sticky top-0 z-20 flex justify-center items-center px-6 py-3 bg-black/30 backdrop-blur-md text-white border-b border-b-white/10 shadow-lg">
            <div className="flex items-center">
                <h1 className="text-lg font-bold tracking-wide">{title}</h1>
            </div>
            <div className="fixed right-6">
                <UserButton />
            </div>
            <div className="w-24"></div>
        </nav>
    );
};

export default Navbar;
