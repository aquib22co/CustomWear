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
        <div className="text-white">
            <h3 className="text-lg font-bold mb-4">Canvas Settings</h3>
            <div className="space-y-4">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Canvas Width</label>
                    <input
                        type="number"
                        value={canvasWidth}
                        onChange={handleWidthChange}
                        className="bg-gray-700 rounded px-3 py-1 text-white"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Canvas Height</label>
                    <input
                        type="number"
                        value={canvasHeight}
                        onChange={handleHeightChange}
                        className="bg-gray-700 rounded px-3 py-1 text-white"
                    />
                </div>
            </div>
        </div>
    )
}

export default CanvasSettings