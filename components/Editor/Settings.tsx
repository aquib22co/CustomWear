"use client";
import React, { useState, useEffect } from "react";
import { Canvas, FabricObject } from "fabric";

// Define more specific types for our Fabric objects
interface FabricTypeObject {
  type?: string;
  width?: number;
  height?: number;
  fill?: string | null;
  scaleX?: number;
  scaleY?: number;
  radius?: number;
  set?: any
}

interface SettingsProps {
  canvas: Canvas | null;
}

export const Settings: React.FC<SettingsProps> = ({ canvas }) => {
  const [selectedObject, setSelectedObject] = useState<FabricTypeObject | any>(null);
  const [width, setWidth] = useState<number|string>("");
  const [height, setHeight] = useState<number|string>("");
  const [diameter, setDiameter] = useState<FabricTypeObject|any>();
  const [color, setColor] = useState<FabricTypeObject|any>("");

  const clearSettings = () => {
    setWidth("");
    setHeight("");
    setDiameter("");
    setColor("");
  };

  const handleObjectSelection = (object: FabricTypeObject | null) => {
    if (!object) return;
    setSelectedObject(object);

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
    }
  };

  const handleWidthChange = (e:any)=> {
    const value = e.target.value.replace(/,/g,"");
    const intValue = parseInt(value,10);

    if(selectedObject && selectedObject.type == "rect" && intValue >= 0){
      selectedObject.set({ width: intValue / selectedObject.scaleX});
      canvas?.renderAll();
    }
    setWidth(intValue)
  }
  const handleHeightChange = (e:any)=> {
    const value = e.target.value.replace(/,/g,"");
    const intValue = parseInt(value,10);

    if(selectedObject && selectedObject.type == "rect" && intValue >= 0){
      selectedObject.set({ height: intValue / selectedObject.scaleY});
      canvas?.renderAll();
    }
    setHeight(intValue)
  }
  
  const handleColorChange = (e:any)=> {
    const value = e.target.value;

    setColor(value);

    if(selectedObject){
      selectedObject.set({fill: value})
      canvas?.renderAll();
    }
  }
  const handleDiameterChange = (e:any)=> {
    const value = e.target.value.replace(/,/g,"");
    const intValue = parseInt(value,10);

    setDiameter(intValue);

    if(selectedObject && selectedObject.type === "circle" && intValue >= 0){
      selectedObject.set({radius : intValue /2/ selectedObject.scaleX});
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
  }, [canvas]); // Add canvas as dependency

  return (
    <div>
      {selectedObject && (
        <div className="p-4 text-white">
          <h3 className="text-lg font-bold mb-4">Object Settings</h3>
          <div className="space-y-4">
            {selectedObject.type === "rect" && (
              <>
                <div>
                  <label className="block mb-1">Width:</label>
                  <input
                    type="number"
                    value={width}
                    onChange={handleWidthChange}
                    className="border p-1 text-black"
                  />
                </div>
                <div>
                  <label className="block mb-1">Height:</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(handleHeightChange)}
                    className="border p-1 text-black"
                  />
                </div>
              </>
            )}
            {selectedObject.type === "circle" && (
              <div>
                <label className="block mb-1">Diameter:</label>
                <input
                  type="number"
                  value={diameter}
                  onChange={handleDiameterChange}
                  className="border p-1 text-black"
                />
              </div>
            )}
            <div>
              <label className="block mb-1">Color:</label>
              <input
                type="color"
                value={color}
                onChange={handleColorChange}
                className="border p-1 text-black"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;