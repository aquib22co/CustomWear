import React, { useState, useEffect } from 'react'
import { Canvas } from 'fabric'

interface CanvasSettingsProps {
    canvas: Canvas | null;
}

function CanvasSettings({ canvas }: CanvasSettingsProps) {
    const [canvasHeight, setCanvasHeight] = useState(500);
    const [canvasWidth, setCanvasWidth] = useState(500);

    useEffect(() => {
        if (canvas && canvas.lowerCanvasEl) {
            canvas.setDimensions({ width: canvasWidth, height: canvasHeight });
            canvas.renderAll();
        }
    }, [canvasHeight, canvasWidth, canvas]);

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/,/g, "");
        const intValue = parseInt(value, 10);
        if (intValue >= 0) {
            setCanvasHeight(intValue);
        }
    }

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/,/g, "");
        const intValue = parseInt(value, 10);
        if (intValue >= 0) {
            setCanvasWidth(intValue);
        }
    }

    return (
        <div className="text-gray-200 content-bg p-[33px] rounded-t">
            <h3 className="text-lg font-bold mb-4">Canvas Settings</h3>
            <div className="space-y-4">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-300">Canvas Width</label>
                    <input
                        type="number"
                        value={canvasWidth}
                        onChange={handleWidthChange}
                        className="card-bg rounded border border-gray-600 px-3 py-1 text-gray-400 transition-all hover:bg-gray-800 duration-300 hover:scale-105"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-300">Canvas Height</label>
                    <input
                        type="number"
                        value={canvasHeight}
                        onChange={handleHeightChange}
                        className="card-bg rounded border border-gray-600 px-3 py-1 text-gray-400 transition-all hover:bg-gray-800 duration-300 hover:scale-105"
                    />
                </div>
            </div>
        </div>
    )
}

export default CanvasSettings