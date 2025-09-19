"use client";
import React, { useState, useEffect, useCallback } from "react";
import fabric from "fabric";
import type { Canvas, Object as FabricObject, TEvent } from "fabric/fabric-impl";
import { Trash2 } from "lucide-react";

// Props for the Settings component
interface SettingsProps {
  canvas: Canvas | null;
}

export const Settings: React.FC<SettingsProps> = ({ canvas }) => {
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [width, setWidth] = useState<number | string>("");
  const [height, setHeight] = useState<number | string>("");
  const [diameter, setDiameter] = useState<number | string>("");
  const [color, setColor] = useState<string>("");

  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [fontWeight, setFontWeight] = useState<string>("normal");
  const [fontSize, setFontSize] = useState<number>(30);

  const clearSettings = useCallback(() => {
    setWidth("");
    setHeight("");
    setDiameter("");
    setColor("");
    setFontFamily("Arial");
    setFontWeight("normal");
    setFontSize(30);
  }, []);

  const handleDelete = useCallback(() => {
    if (canvas && selectedObject) {
      canvas.remove(selectedObject);
      canvas.renderAll();
      setSelectedObject(null);
      clearSettings();
    }
  }, [canvas, selectedObject, clearSettings]);

  const handleObjectSelection = useCallback(
    (object: FabricObject | null) => {
      if (!object) {
        setSelectedObject(null);
        clearSettings();
        return;
      }

      setSelectedObject(object);

      if (object instanceof fabric.Rect) {
        setWidth(String(Math.round((object.width || 0) * (object.scaleX || 1))));
        setHeight(String(Math.round((object.height || 0) * (object.scaleY || 1))));
        setColor(object.fill?.toString() || "");
        setDiameter("");
      } else if (object instanceof fabric.Circle) {
        const radius = object.radius || 0;
        setDiameter(String(Math.round(radius * 2 * (object.scaleX || 1))));
        setWidth("");
        setHeight("");
        setColor(object.fill?.toString() || "");
      } else if (object instanceof fabric.Textbox || object instanceof fabric.Text) {
        setFontFamily(object.fontFamily || "Arial");
        setFontWeight(object.fontWeight?.toString() || "normal");
        setFontSize(object.fontSize || 30);
        setColor(object.fill?.toString() || "");
        setWidth("");
        setHeight("");
        setDiameter("");
      } else {
        clearSettings();
      }
    },
    [clearSettings]
  );

  const handleWidthChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/,/g, "");
      const intValue = parseInt(value, 10);

      if (selectedObject instanceof fabric.Rect && !isNaN(intValue) && intValue >= 0) {
        selectedObject.set({ width: intValue / (selectedObject.scaleX || 1) });
        canvas?.renderAll();
      }
      setWidth(value);
    },
    [selectedObject, canvas]
  );

  const handleHeightChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/,/g, "");
      const intValue = parseInt(value, 10);

      if (selectedObject instanceof fabric.Rect && !isNaN(intValue) && intValue >= 0) {
        selectedObject.set({ height: intValue / (selectedObject.scaleY || 1) });
        canvas?.renderAll();
      }
      setHeight(value);
    },
    [selectedObject, canvas]
  );

  const handleDiameterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/,/g, "");
      const intValue = parseInt(value, 10);

      if (selectedObject instanceof fabric.Circle && !isNaN(intValue) && intValue >= 0) {
        selectedObject.set({ radius: intValue / 2 / (selectedObject.scaleX || 1) });
        canvas?.renderAll();
      }
      setDiameter(value);
    },
    [selectedObject, canvas]
  );

  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setColor(value);
      selectedObject?.set({ fill: value });
      canvas?.renderAll();
    },
    [selectedObject, canvas]
  );

  const handleFontFamilyChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setFontFamily(value);
      if (selectedObject instanceof fabric.Textbox || selectedObject instanceof fabric.Text) {
        selectedObject.set({ fontFamily: value });
        canvas?.renderAll();
      }
    },
    [selectedObject, canvas]
  );

  const handleFontWeightChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setFontWeight(value);
      if (selectedObject instanceof fabric.Textbox || selectedObject instanceof fabric.Text) {
        selectedObject.set({ fontWeight: value });
        canvas?.renderAll();
      }
    },
    [selectedObject, canvas]
  );

  const handleFontSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value)) {
        setFontSize(value);
        if (selectedObject instanceof fabric.Textbox || selectedObject instanceof fabric.Text) {
          selectedObject.set({ fontSize: value });
          canvas?.renderAll();
        }
      }
    },
    [selectedObject, canvas]
  );

  useEffect(() => {
    if (canvas) {
      const handleSelection = (event: TEvent) => {
        handleObjectSelection(event.selected?.[0] || event.target || null);
      };

      canvas.on("selection:created", handleSelection);
      canvas.on("selection:updated", handleSelection);
      canvas.on("selection:cleared", () => {
        setSelectedObject(null);
        clearSettings();
      });
      canvas.on("object:modified", handleSelection);
      canvas.on("object:scaling", handleSelection);

      canvas.renderAll();

      return () => {
        canvas.off("selection:created", handleSelection);
        canvas.off("selection:updated", handleSelection);
        canvas.off("selection:cleared");
        canvas.off("object:modified", handleSelection);
        canvas.off("object:scaling", handleSelection);
      };
    }
  }, [canvas, clearSettings, handleObjectSelection]);

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

              {selectedObject instanceof fabric.Rect && (
                <>
                  <div className="transition-transform duration-300 hover:scale-105">
                    <label className="block mb-1 text-gray-500">Width:</label>
                    <input type="number" value={width} onChange={handleWidthChange} className="border p-1 text-gray-400 card-bg rounded" />
                  </div>
                  <div className="transition-transform duration-300 hover:scale-105">
                    <label className="block mb-1 text-gray-500">Height:</label>
                    <input type="number" value={height} onChange={handleHeightChange} className="border p-1 text-gray-400 card-bg rounded" />
                  </div>
                </>
              )}

              {selectedObject instanceof fabric.Circle && (
                <div className="transition-transform duration-300 hover:scale-105">
                  <label className="block mb-1 text-gray-500">Diameter:</label>
                  <input type="number" value={diameter} onChange={handleDiameterChange} className="border p-1 text-gray-400 card-bg rounded" />
                </div>
              )}

              {(selectedObject instanceof fabric.Text || selectedObject instanceof fabric.Textbox) && (
                <>
                  <div className="transition-transform duration-300 hover:scale-105">
                    <label className="block mb-1 text-gray-500">Font Family:</label>
                    <select value={fontFamily} onChange={handleFontFamilyChange} className="border p-1 text-gray-400 card-bg rounded">
                      <option value="Arial">Arial</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Courier">Courier</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Verdana">Verdana</option>
                    </select>
                  </div>
                  <div className="transition-transform duration-300 hover:scale-105">
                    <label className="block mb-1 text-gray-500">Font Weight:</label>
                    <select value={fontWeight} onChange={handleFontWeightChange} className="border p-1 text-gray-400 card-bg rounded">
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                      <option value="lighter">Lighter</option>
                      <option value="bolder">Bolder</option>
                    </select>
                  </div>
                  <div className="transition-transform duration-300 hover:scale-105">
                    <label className="block mb-1 text-gray-500">Font Size:</label>
                    <input type="number" value={fontSize} onChange={handleFontSizeChange} className="border p-1 text-gray-400 card-bg rounded" />
                  </div>
                </>
              )}

              <div className="flex flex-col items-center transition-transform duration-300 hover:scale-105">
                <label className="block mb-1 text-gray-500">Color:</label>
                <div className="relative">
                  <input type="color" value={color} onChange={handleColorChange} className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" />
                  <div className="w-10 h-10 border rounded-full" style={{ backgroundColor: color }}></div>
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
