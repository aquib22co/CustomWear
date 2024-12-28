"use client";
import React, { useState, useEffect } from "react";
import { Canvas, FabricObject } from "fabric";
import { Trash2 } from "lucide-react";

// Define more specific types for our Fabric objects
interface FabricTypeObject {
  type?: string;
  width?: number;
  height?: number;
  fill?: string | null;
  scaleX?: number;
  scaleY?: number;
  radius?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontSize?: number;
}

interface SettingsProps {
  canvas: Canvas | null;
}

export const Settings: React.FC<SettingsProps> = ({ canvas }) => {
  const [selectedObject, setSelectedObject] = useState<FabricTypeObject | any>(null);
  const [width, setWidth] = useState<number | string>("");
  const [height, setHeight] = useState<number | string>("");
  const [diameter, setDiameter] = useState<FabricTypeObject | any>();
  const [color, setColor] = useState<FabricTypeObject | any>("");
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [fontWeight, setFontWeight] = useState<string>("normal");
  const [fontSize, setFontSize] = useState<number>(30);

  const clearSettings = () => {
    setWidth("");
    setHeight("");
    setDiameter("");
    setColor("");
    setFontFamily("Arial");
    setFontWeight("normal");
    setFontSize(30);
  };

  const handleDelete = () => {
    if (canvas && selectedObject) {
      canvas.remove(selectedObject);
      canvas.renderAll();
      setSelectedObject(null);
      clearSettings();
    }
  }

  const handleObjectSelection = (object: FabricTypeObject | null) => {
    if (!object) return;
    setSelectedObject(object);
    console.log(object.type);
    // Update dimensions based on the selected object
    if (object.type === "rect") {
      setWidth(String(Math.round((object.width || 0) * (object.scaleX || 1))));
      setHeight(String(Math.round((object.height || 0) * (object.scaleY || 1))));
      setColor(object.fill?.toString() || "");
      setDiameter("");
    } else if (object.type === "circle") {
      const radius = object.radius || 0;
      setDiameter(String(Math.round(radius * 2 * (object.scaleX || 1))));
      setWidth("");
      setHeight("");
      setColor(object.fill?.toString() || "");
    } else if (object.type === "textbox" || object.type === "text") {
      // If it's a text object, update font-related properties
      setFontFamily(object.fontFamily || "Arial");
      setFontWeight(object.fontWeight || "normal");
      setFontSize(object.fontSize || 30);
    }
  };

  const handleWidthChange = (e: any) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);

    if (selectedObject && selectedObject.type == "rect" && intValue >= 0) {
      selectedObject.set({ width: intValue / selectedObject.scaleX });
      canvas?.renderAll();
    }
    setWidth(intValue);
  }

  const handleHeightChange = (e: any) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);

    if (selectedObject && selectedObject.type == "rect" && intValue >= 0) {
      selectedObject.set({ height: intValue / selectedObject.scaleY });
      canvas?.renderAll();
    }
    setHeight(intValue);
  }

  const handleColorChange = (e: any) => {
    const value = e.target.value;

    setColor(value);

    if (selectedObject) {
      selectedObject.set({ fill: value });
      canvas?.renderAll();
    }
  }

  const handleDiameterChange = (e: any) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);

    setDiameter(intValue);

    if (selectedObject && selectedObject.type === "circle" && intValue >= 0) {
      selectedObject.set({ radius: intValue / 2 / selectedObject.scaleX });
      canvas?.renderAll();
    }
  }

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFontFamily(value);
    if (selectedObject && selectedObject.type === "text") {
      selectedObject.set({ fontFamily: value });
      canvas?.renderAll();
    }
  }

  const handleFontWeightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFontWeight(value);
    if (selectedObject && selectedObject.type === "text") {
      selectedObject.set({ fontWeight: value });
      canvas?.renderAll();
    }
  }

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setFontSize(value);
    if (selectedObject && selectedObject.type === "text") {
      selectedObject.set({ fontSize: value });
      canvas?.renderAll();
    }
  }

  useEffect(() => {
    if (canvas) {
      const handleSelection = (event: any) => {
        handleObjectSelection(event.selected?.[0] || event.target);
      };

      canvas.on("selection:created", handleSelection);
      canvas.on("selection:updated", handleSelection);
      canvas.on("selection:cleared", () => {
        setSelectedObject(null);
        clearSettings();
      });
      canvas.on("object:modified", handleSelection);
      canvas.on("object:scaling", handleSelection);

      canvas?.renderAll()

      // Cleanup function
      return () => {
        canvas.off("selection:created");
        canvas.off("selection:updated");
        canvas.off("selection:cleared");
        canvas.off("object:modified");
        canvas.off("object:scaling");
      };

    }
  }, [canvas]);

  return (
    <div>
      {selectedObject && (
        <div className="p-4 mt-8 mb-4 content-bg border rounded shadow-lg text-white transition-transform duration-300 hover:scale-105">
          <h3 className="text-lg font-bold mb-4">Object Settings</h3>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
              <button
                onClick={handleDelete}
                className="p-2 mt-6 bg-red-500 hover:bg-red-600 rounded flex items-center gap-2 transition-colors duration-300 hover:scale-105"
              >
                <Trash2 size={18} />
              </button>
              {selectedObject.type === "rect" && (
                <>
                  <div className="transition-transform duration-300 hover:scale-105">
                    <label className="block mb-1 text-gray-500">Width:</label>
                    <input
                      type="number"
                      value={width}
                      onChange={handleWidthChange}
                      className="border-gray-600 border-[0.5px] p-1 text-gray-400 card-bg rounded"
                    />
                  </div>
                  <div className="transition-transform duration-300 hover:scale-105">
                    <label className="block mb-1 text-gray-500">Height:</label>
                    <input
                      type="number"
                      value={height}
                      onChange={handleHeightChange}
                      className="border-gray-600 border-[0.5px] p-1 text-gray-400 card-bg rounded"
                    />
                  </div>
                </>
              )}
              {selectedObject.type === "circle" && (
                <div className="transition-transform duration-300 hover:scale-105">
                  <label className="block mb-1 text-gray-500">Diameter:</label>
                  <input
                    type="number"
                    value={diameter}
                    onChange={handleDiameterChange}
                    className="border-gray-600 border-[0.5px] p-1 text-gray-400 card-bg rounded"
                  />
                </div>
              )}
              {selectedObject?.type === "text" || selectedObject?.type === "textbox" && (
                <>
                  <div className="transition-transform duration-300 hover:scale-105">
                    <label className="block mb-1 text-gray-500">Font Family:</label>
                    <select
                      value={fontFamily}
                      onChange={handleFontFamilyChange}
                      className="border-gray-600 border-[0.5px] p-1 text-gray-400 card-bg rounded"
                    >
                      <option value="Arial">Arial</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Courier">Courier</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Verdana">Verdana</option>
                    </select>
                  </div>
                  <div className="transition-transform duration-300 hover:scale-105">
                    <label className="block mb-1 text-gray-500">Font Weight:</label>
                    <select
                      value={fontWeight}
                      onChange={handleFontWeightChange}
                      className="border-gray-600 border-[0.5px] p-1 text-gray-400 card-bg rounded"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                      <option value="lighter">Lighter</option>
                      <option value="bolder">Bolder</option>
                    </select>
                  </div>
                  <div className="transition-transform duration-300 hover:scale-105">
                    <label className="block mb-1 text-gray-500">Font Size:</label>
                    <input
                      type="number"
                      value={fontSize}
                      onChange={handleFontSizeChange}
                      className="border-gray-600 border-[0.5px] p-1 text-gray-400 card-bg rounded"
                    />
                  </div>
                </>
              )}
              <div className="flex flex-col items-center transition-transform duration-300 hover:scale-105">
                <label className="block mb-1 text-gray-500">Color:</label>
                <div className="relative">
                  <input
                    type="color"
                    value={color}
                    onChange={handleColorChange}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                  />
                  <div className="w-10 h-10 border border-gray-600 rounded-full" style={{ backgroundColor: color }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
