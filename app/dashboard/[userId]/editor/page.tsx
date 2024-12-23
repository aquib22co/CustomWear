"use client";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/dashboard/Navbar";
import SideBar from "@/components/dashboard/SideBar";
import React, { useEffect, useState, useRef } from "react";
import { Canvas, Rect, FabricImage, Circle } from "fabric";
import { Button } from "@/components/ui/button";
import { FaRegSquare } from "react-icons/fa";

const Editor = () => {
    const { user } = useUser();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [canvas, setCanvas] = useState<Canvas | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const initCanvas = new Canvas(canvasRef.current, {
                width: 500,
                height: 500,
            });

            initCanvas.backgroundColor = "#fff";
            initCanvas.renderAll();

            setCanvas(initCanvas);

            FabricImage.fromURL("/T-Shirt.png", {
                crossOrigin: 'anonymous'
            }).then(img => {
                img.scaleToWidth(400);
                img.scaleToHeight(400);
                initCanvas.add(img);
                initCanvas.renderAll();
            })

            return () => {
                initCanvas.dispose();
            };
        }
    }, []);

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

    const addCircle = () => {
        if(canvas){
            const circle = new Circle({
                top : 150,
                left : 150,
                radius : 50,
                fill : "red"
            })
            canvas.add(circle)
        }
    }
    return (
        <div>
            <Navbar title="Editor" />
            {user && <SideBar userId={user.id} />}
            <div className="flex items-center justify-center h-screen ">
                <div className="flex flex-col items-center space-y-4">
                    <Button
                        onClick={addRectangle}
                        variant="ghost"
                        size="default"
                        className="flex items-center space-x-2"
                    >
                        <FaRegSquare />
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
                </div>
                <canvas
                    id="canvas"
                    ref={canvasRef}
                    className="shadow-lg border border-gray-300"
                />
            </div>
        </div>
    );
};

export default Editor;
