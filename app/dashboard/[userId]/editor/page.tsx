"use client";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/dashboard/Navbar";
import SideBar from "@/components/dashboard/SideBar";
import React, { useEffect, useState, useRef } from "react";
import { Canvas, Rect, FabricImage, Circle, Triangle, PencilBrush, Line, Textbox } from "fabric";
import { Button } from "@/components/ui/button";
import Settings from "@/components/Editor/Settings";
import { Square, TriangleIcon, CircleIcon, Brush, Ban, Slash, Type } from "lucide-react"
import ClothesPanel from "@/components/Editor/ClothesPanel";
import CanvasSettings from "@/components/Editor/CanvasSettings";
import { handleObjectMoving, clearGuidelines } from "@/components/Editor/SnappingHelper";
import Cropping from "@/components/Editor/Cropping";
import { Dock, DockIcon } from "@/components/ui/dock";
import CroppingSettings from "@/components/Editor/CroppingSettings";

const Editor = () => {
    const { user } = useUser();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [canvas, setCanvas] = useState<Canvas | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushColor, setBrushColor] = useState("#000000");
    const [brushWidth, setBrushWidth] = useState(5);
    const [refreshKey, setResfreshKey] = useState();


    useEffect(() => {
        if (canvasRef.current) {
            const initCanvas = new Canvas(canvasRef.current, {
                width: 500,
                height: 500,
            });

            initCanvas.backgroundColor = "#fff";
            initCanvas.renderAll();

            setCanvas(initCanvas);

            // initCanvas.on("object:moving", (event) => {
            //     if (event.target) {
            //         handleObjectMoving(initCanvas, event.target, guidelines, setGuidelines);
            //     }
            // });

            // // Clear guidelines on selection:cleared
            // initCanvas.on("object:modified", () => {
            //     clearGuidelines(initCanvas);
            // });


            return () => {
                initCanvas.dispose();
            };
        }
    }, []);

    const toggleDrawingMode = () => {
        if (canvas) {
            canvas.isDrawingMode = !isDrawing;
            canvas.freeDrawingBrush = new PencilBrush(canvas);
            canvas.freeDrawingBrush.color = brushColor;
            canvas.freeDrawingBrush.width = brushWidth;
            canvas.renderAll()
            setIsDrawing(!isDrawing);
        }
    };

    const updateBrushColor = (color: string) => {
        setBrushColor(color);
        if (canvas && canvas.freeDrawingBrush) canvas.freeDrawingBrush.color = color;
    };

    const updateBrushWidth = (width: number) => {
        setBrushWidth(width);
        if (canvas && canvas.freeDrawingBrush) canvas.freeDrawingBrush.width = width;
    };

    const handleFramesUpdate = () => {
        setResfreshKey((prevKey: any) => prevKey + 1)
    }
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

    const addLine = () => {
        if (canvas) {
            const line = new Line([50, 50, 200, 200], {
                stroke: "black", // Color of the line
                strokeWidth: 2, // Thickness of the line
            });

            canvas.add(line);
            canvas.renderAll();
        }
    };

    const addText = () => {
        if (canvas) {
            const text = new Textbox("Hello, World!", {
                left: 100,
                top: 100,
                fontFamily: "Arial", // Set font family
                fontWeight: "normal", // Set font weight
                fontSize: 30, // Set font size
                fill: "black", // Set text color
            });

            canvas.add(text);
            canvas.renderAll();
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
            <div className="flex flex-col md:flex-row  justify-center">
                <div className="relative h-fit left-20 top-10 md:top-40">
                    <ClothesPanel onSelectClothing={handleClothingSelect} />
                </div>
                <div className="flex flex-col justify-center items-center h-full w-full ">
                    <div className="relative mb-8">
                        <Dock iconMagnification={60} iconDistance={100}>
                            <DockIcon className="bg-white/10">
                                <Button
                                    onClick={addRectangle}
                                >
                                    <Square className="text-white" />
                                </Button>
                            </DockIcon>
                            <DockIcon className="bg-white/10">
                                <Button
                                    onClick={addCircle}
                                >
                                    <CircleIcon className="text-white" />
                                </Button>
                            </DockIcon>
                            <DockIcon className="bg-white/10">
                                <Button
                                    onClick={addTriangle}
                                >
                                    <TriangleIcon className="text-white" />
                                </Button>
                            </DockIcon>
                            <DockIcon className="bg-white/10">
                                <Button
                                    onClick={addLine}
                                >
                                    <Slash className="text-white" />
                                </Button>
                            </DockIcon>
                            <DockIcon className="bg-white/10">
                                <Button
                                    onClick={addText}
                                >
                                    <Type className="text-white" />
                                </Button>
                            </DockIcon>
                            <DockIcon className="bg-white/10">
                                <Button onClick={toggleDrawingMode}>
                                    {isDrawing ? <Ban className="text-white" /> : <Brush className="text-white" />}
                                </Button>
                            </DockIcon>
                            <div className="border-l border-gray-300 h-10"></div>
                            <DockIcon className="bg-white/10">
                                <Cropping canvas={canvas} onFrameUpdate={handleFramesUpdate} />
                            </DockIcon>
                        </Dock>
                        {isDrawing &&
                            <div className="flex justify-center items-center rounded-md transition-all duration-300 ease-in-out hover:shadow-lg">
                                <div className="flex flex-col text-white items-center p-2">
                                    <label className="mb-2">Brush Color:</label>
                                    <div className="relative">
                                        <input
                                            type="color"
                                            value={brushColor}
                                            onChange={(e) => updateBrushColor(e.target.value)}
                                            className="border border-gray-900 rounded-full w-10 h-10 cursor-pointer"
                                            style={{ appearance: 'none', padding: 0 }}
                                        />
                                        <div className="absolute inset-0 rounded-full border-2 border-white pointer-events-none"></div>
                                    </div>
                                </div>
                                <div className="flex flex-col text-white items-center p-2">
                                    <label className="mb-2">Brush Width:</label>
                                    <input
                                        type="number"
                                        className="text-gray-400 card-bg border border-gray-300 rounded py-1 px-3 transition-all duration-300 ease-in-out hover:border-gray-500"
                                        min="1"
                                        max="50"
                                        value={brushWidth}
                                        onChange={(e) => updateBrushWidth(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        }
                    </div>
                    <canvas
                        id="canvas"
                        ref={canvasRef}
                        className="shadow-lg border border-gray-900"
                    />

                    <Settings canvas={canvas} />
                </div>
                <div className="flex flex-col justify-center items-center">
                    <CanvasSettings canvas={canvas} />
                    <CroppingSettings canvas={canvas} refreshKey={refreshKey} />
                </div>
            </div>

        </div>
    );
};

export default Editor;
