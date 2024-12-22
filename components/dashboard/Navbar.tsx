import { FaUndo, FaRedo } from 'react-icons/fa';

const Navbar = ({ title }: { title: string }) => {
    return (
        <nav className="flex justify-between items-center px-6 py-3 bg-black/30 backdrop-blur-md text-white border-b border-b-white/10 shadow-lg">
            <div className="flex space-x-4">
                <button className="flex items-center space-x-2 text-sm hover:text-gray-200">
                    <FaUndo />
                    <span>Undo</span>
                </button>
                <button className="flex items-center space-x-2 text-sm hover:text-gray-200">
                    <FaRedo />
                    <span>Redo</span>
                </button>
            </div>
            <div className="flex-grow text-center">
                <h1 className="text-lg font-bold tracking-wide">{title}</h1>
            </div>
            <div className="w-24"></div>
        </nav>
    );
};

export default Navbar;
