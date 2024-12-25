"use client";
import React from 'react';
import Image from 'next/image';

interface ClothingItem {
    id: string;
    name: string;
    imagePath: string;
}

const clothingItems: ClothingItem[] = [
    {
        id: '1',
        name: 'Multi Colored Full Sleeves T-Shirt',
        imagePath: '/Clothes/Full_sleeve.webp',
    },
    {
        id: '2',
        name: 'Grey Hoodie',
        imagePath: '/Clothes/101-1017710_hoodie-grey-hoodie-front-and-back.webp',
    },
    {
        id: '3',
        name: 'White Sweat Shirt',
        imagePath: '/Clothes/isolated-t-shirt-1852114_1280.webp',
    },
    {
        id: '4',
        name: 'Red Collared T-Shirt',
        imagePath: '/Clothes/red_collared_t-shirt.webp',
    },
]

interface ClothesPanelProps {
    onSelectClothing: (imagePath: string) => void;
}

const ClothesPanel: React.FC<ClothesPanelProps> = ({ onSelectClothing }) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg w-64">
            <h3 className="text-white text-lg font-bold mb-4">Select Clothing</h3>
            <div className="grid grid-cols-2 gap-3">
                {clothingItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onSelectClothing(item.imagePath)}
                        className="bg-gray-700 p-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        <div className="relative w-full aspect-square mb-2">
                            <Image
                                src={item.imagePath}
                                alt={item.name}
                                fill
                                className="object-contain p-1"
                            />
                        </div>
                        <p className="text-sm text-white truncate">{item.name}</p>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default ClothesPanel