"use client";
import React, { useState } from "react";
import Image from "next/image";

interface ClothingItem {
    id: string;
    name: string;
    imagePath: string;
}

const initialClothingItems: ClothingItem[] = [
    {
        id: "1",
        name: "Sweat-Shirt",
        imagePath: "/Clothes/S1.png",
    },
    {
        id: "2",
        name: "Hoodie",
        imagePath: "/Clothes/S2.png",
    },
    {
        id: "3",
        name: "Collared T-Shirt",
        imagePath: "/Clothes/S3.png",
    },
    {
        id: "4",
        name: "T-Shirt",
        imagePath: "/Clothes/S4.png",
    },
];

interface ClothesPanelProps {
    onSelectClothing: (imagePath: string) => void;
}

const ClothesPanel: React.FC<ClothesPanelProps> = ({ onSelectClothing }) => {
    const [clothingItems, setClothingItems] = useState<ClothingItem[]>(initialClothingItems);
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);

        try {
            const response = await fetch("/api/editor/upload", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const { fileName } = await response.json();

                // Add the uploaded file to the clothingItems array
                setClothingItems((prevItems) => [
                    ...prevItems,
                    {
                        id: String(prevItems.length + 1),
                        name: file.name,
                        imagePath: `/Clothes/${fileName}`,
                    },
                ]);
            } else {
                console.error("Failed to upload image.");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="content-bg p-4 rounded w-64 m-6 transition-transform duration-300 hover:scale-105">
            <h3 className="text-white text-lg font-bold mb-4">Select Clothing</h3>
            <div className="grid grid-cols-2 gap-3">
                {clothingItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onSelectClothing(item.imagePath)}
                        className="card-bg p-2 rounded hover:bg-gray-600 transition-all duration-300 hover:scale-105"
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
            <div className="mt-4">
                <label className="block mb-2 text-gray-500">Upload Your Design:</label>
                <input
                    type="file"
                    accept="image/png"
                    onChange={handleFileUpload}
                    className="w-full p-1 text-gray-400 bg-gray-800 rounded"
                />
                {uploading && <p className="text-sm text-gray-400 mt-2">Uploading...</p>}
            </div>
        </div>
    );
};

export default ClothesPanel;
