"use client";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/dashboard/Navbar";
import SideBar from "@/components/dashboard/SideBar";
import React, { useEffect, useState, useRef } from "react";
import { Canvas, Rect, FabricImage, Circle, Triangle } from "fabric";
import { Button } from "@/components/ui/button";
import Settings from "@/components/Editor/Settings";
import ClothesPanel from "@/components/Editor/ClothesPanel";
import CanvasSettings from "@/components/Editor/CanvasSettings";
import { handleObjectMoving,clearGuidelines } from "@/components/Editor/SnappingHelper";

const Editor = () => {
    const { user } = useUser();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [canvas, setCanvas] = useState<Canvas | null>(null);
    const [guidelines,setGuidelines] = useState([])

    useEffect(() => {
        if (canvasRef.current) {
            const initCanvas = new Canvas(canvasRef.current, {
                width: 500,
                height: 500,
            });

            initCanvas.backgroundColor = "#fff";
            initCanvas.renderAll();

            setCanvas(initCanvas);

            initCanvas.on("object:moving", (event) => {
                if (event.target) {
                    handleObjectMoving(initCanvas, event.target, guidelines, setGuidelines);
                }
            });

            // Clear guidelines on selection:cleared
            initCanvas.on("object:modified", () => {
                clearGuidelines(initCanvas);
            });


            return () => {
                initCanvas.dispose();
            };
        }
    }, [guidelines]);
    const handleClothingSelect = (imagePath: string) => {
        if (canvas) {
            FabricImage.fromURL(imagePath, {
                crossOrigin: 'anonymous'
            }).then(img => {
                img.scaleToWidth(400);
                img.scaleToHeight(400);

                canvas.add(img);
                canvas.renderAll();
            }).catch(err => {
                console.error("Error Laoding the image :", err);
            })
        }
    }
    const addRectangle = () => {
        if (canvas) {
            const rect = new Rect({
                top: 100,
                left: 50,
                width: 100,
                height: 60,
                fill: "blue"
            })

            canvas.add(rect)
        }
    };

    const addTriangle = () => {
        if (canvas) {
            const triangle = new Triangle({
                top: 100,
                height: 60,
                left: 100,
                width: 100,
                fill: "black",
                stroke: "pink",
                strokeWidth: 2,
            })

            canvas.add(triangle);
        }
    }

    const addCircle = () => {
        if (canvas) {
            const circle = new Circle({
                top: 150,
                left: 150,
                radius: 50,
                fill: "red"
            })
            canvas.add(circle)
        }
    }

    return (
        <div>
            <Navbar title="Editor" />
            {user && <SideBar userId={user.id} />}
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center space-y-4">
                    <ClothesPanel onSelectClothing={handleClothingSelect} />
                    <Button
                        onClick={addRectangle}
                        variant="ghost"
                        size="default"
                        className="flex items-center space-x-2"
                    >
                        <span className="text-white">Add Rectangle</span>
                    </Button>

                    <Button
                        onClick={addCircle}
                        variant="ghost"
                        size="lg"
                        className="flex items-center space-x-2"
                    >
                        <span className="text-white">Add Circle</span>

                    </Button>

                    <Button
                        onClick={addTriangle}
                        variant="ghost"
                        size="lg"
                        className="flex items-center space-x-2"
                    >
                        <span className="text-white">Add Triangle</span>

                    </Button>
                </div>
                <canvas
                    id="canvas"
                    ref={canvasRef}
                    className="shadow-lg border border-gray-300"
                />
                <div className="flex justify-end">
                    <Settings canvas={canvas} />
                    <CanvasSettings canvas={canvas} />
                </div>

            </div>
        </div>
    );
};

export default Editor;
