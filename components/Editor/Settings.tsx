"use client";
import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
// Import specific types from 'fabric' for better type safety
// FIX: Changed IEvent to TEvent as suggested by the error message.
import { Canvas, Object as FabricObject, TEvent, IRectOptions, ICircleOptions, ITextOptions, ITextboxOptions } from "fabric";
import { Trash2 } from "lucide-react";

// Define a union type for selected Fabric objects, including their specific properties
// This allows selectedObject to be any of these specific types or the base FabricObject
type SelectableFabricObject = (FabricObject & (IRectOptions | ICircleOptions | ITextOptions | ITextboxOptions));

// Props for the Settings component
interface SettingsProps {
  canvas: Canvas | null; // The Fabric.js Canvas instance, can be null if not yet initialized
}

export const Settings: React.FC<SettingsProps> = ({ canvas }) => {
  // State to hold the currently selected Fabric.js object.
  // It can be a SelectableFabricObject (a union of common Fabric types) or null.
  const [selectedObject, setSelectedObject] = useState<SelectableFabricObject | null>(null);

  // States for object properties, using number | string for input values that can be empty
  const [width, setWidth] = useState<number | string>("");
  const [height, setHeight] = useState<number | string>("");
  const [diameter, setDiameter] = useState<number | string>(""); // For circle radius * 2
  const [color, setColor] = useState<string>(""); // Color is always a string

  // States for text-specific properties
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [fontWeight, setFontWeight] = useState<string>("normal");
  const [fontSize, setFontSize] = useState<number>(30);

  // Clears all input settings to their default/empty states
  const clearSettings = useCallback(() => {
    setWidth("");
    setHeight("");
    setDiameter("");
    setColor("");
    setFontFamily("Arial");
    setFontWeight("normal");
    setFontSize(30);
  }, []); // No dependencies, so can be memoized

  // Handles deleting the selected object from the canvas
  const handleDelete = useCallback(() => {
    if (canvas && selectedObject) {
      canvas.remove(selectedObject); // Remove the object
      canvas.renderAll(); // Re-render canvas to reflect the change
      setSelectedObject(null); // Clear selected object state
      clearSettings(); // Clear settings inputs
    }
  }, [canvas, selectedObject, clearSettings]); // Dependencies for useCallback

  // Updates settings based on the newly selected object
  const handleObjectSelection = useCallback((object: FabricObject | null) => {
    if (!object) {
      setSelectedObject(null);
      clearSettings();
      return;
    }

    // Cast object to SelectableFabricObject for easier property access,
    // relying on checks below to ensure valid property access.
    const currentObject = object as SelectableFabricObject;
    setSelectedObject(currentObject);

    // Update dimensions and color based on object type
    if (currentObject.type === "rect") {
      setWidth(String(Math.round((currentObject.width || 0) * (currentObject.scaleX || 1))));
      setHeight(String(Math.round((currentObject.height || 0) * (currentObject.scaleY || 1))));
      setColor(currentObject.fill?.toString() || "");
      setDiameter(""); // Clear diameter for rects
    } else if (currentObject.type === "circle") {
      const radius = (currentObject as FabricObject & ICircleOptions).radius || 0;
      setDiameter(String(Math.round(radius * 2 * (currentObject.scaleX || 1))));
      setWidth(""); // Clear width for circles
      setHeight(""); // Clear height for circles
      setColor(currentObject.fill?.toString() || "");
    } else if (currentObject.type === "textbox" || currentObject.type === "text") {
      // If it's a text object, update font-related properties
      const textObject = currentObject as FabricObject & (ITextOptions | ITextboxOptions);
      setFontFamily(textObject.fontFamily || "Arial");
      setFontWeight(textObject.fontWeight || "normal");
      setFontSize(textObject.fontSize || 30);
      setColor(textObject.fill?.toString() || ""); // Text also has fill
      setWidth(""); // Clear dimensions for text
      setHeight("");
      setDiameter("");
    } else {
      // Clear all settings if an unhandled object type is selected
      clearSettings();
    }
  }, [clearSettings]); // Dependency for useCallback

  // Handles changes to the width input for rectangular objects
  const handleWidthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, ""); // Remove commas
    const intValue = parseInt(value, 10); // Parse to integer

    // Only apply if selected object is a rect and value is a valid non-negative number
    if (selectedObject && selectedObject.type === "rect" && !isNaN(intValue) && intValue >= 0) {
      // Fabric.js objects store their original width/height, scaling is applied via scaleX/Y.
      // To set a visual width, divide by current scaleX.
      selectedObject.set({ width: intValue / (selectedObject.scaleX || 1) });
      canvas?.renderAll(); // Re-render canvas
    }
    setWidth(value); // Update local state with string value from input
  }, [selectedObject, canvas]); // Dependencies for useCallback

  // Handles changes to the height input for rectangular objects
  const handleHeightChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);

    if (selectedObject && selectedObject.type === "rect" && !isNaN(intValue) && intValue >= 0) {
      selectedObject.set({ height: intValue / (selectedObject.scaleY || 1) });
      canvas?.renderAll();
    }
    setHeight(value);
  }, [selectedObject, canvas]); // Dependencies for useCallback

  // Handles changes to the color input
  const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setColor(value); // Update local state

    if (selectedObject) {
      selectedObject.set({ fill: value }); // Set fill color for the object
      canvas?.renderAll();
    }
  }, [selectedObject, canvas]); // Dependencies for useCallback

  // Handles changes to the diameter input for circular objects
  const handleDiameterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);

    // Only apply if selected object is a circle and value is a valid non-negative number
    if (selectedObject && selectedObject.type === "circle" && !isNaN(intValue) && intValue >= 0) {
      // For circles, diameter is 2 * radius. Set radius based on desired diameter and scale.
      const circleObject = selectedObject as FabricObject & ICircleOptions;
      circleObject.set({ radius: intValue / 2 / (circleObject.scaleX || 1) });
      canvas?.renderAll();
    }
    setDiameter(value); // Update local state with string value from input
  }, [selectedObject, canvas]); // Dependencies for useCallback

  // Handles changes to the font family select
  const handleFontFamilyChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFontFamily(value);
    // Apply if selected object is text or textbox
    if (selectedObject && (selectedObject.type === "text" || selectedObject.type === "textbox")) {
      const textObject = selectedObject as FabricObject & (ITextOptions | ITextboxOptions);
      textObject.set({ fontFamily: value });
      canvas?.renderAll();
    }
  }, [selectedObject, canvas]); // Dependencies for useCallback

  // Handles changes to the font weight select
  const handleFontWeightChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFontWeight(value);
    if (selectedObject && (selectedObject.type === "text" || selectedObject.type === "textbox")) {
      const textObject = selectedObject as FabricObject & (ITextOptions | ITextboxOptions);
      textObject.set({ fontWeight: value });
      canvas?.renderAll();
    }
  }, [selectedObject, canvas]); // Dependencies for useCallback

  // Handles changes to the font size input
  const handleFontSizeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    // Only apply if value is a valid number
    if (!isNaN(value)) {
      setFontSize(value);
      if (selectedObject && (selectedObject.type === "text" || selectedObject.type === "textbox")) {
        const textObject = selectedObject as FabricObject & (ITextOptions | ITextboxOptions);
        textObject.set({ fontSize: value });
        canvas?.renderAll();
      }
    }
  }, [selectedObject, canvas]); // Dependencies for useCallback

  // useEffect to manage Fabric.js canvas event listeners
  useEffect(() => {
    if (canvas) {
      // Define a handler for selection events
      const handleSelection = (event: TEvent<FabricObject>) => { // FIX: Changed IEvent to TEvent
        // Fabric.js selection events can have `selected` (array) or `target` (single object)
        // Prioritize `selected[0]` if multiple objects are selected, otherwise `target`
        handleObjectSelection(event.selected?.[0] || event.target || null);
      };

      // Attach event listeners
      canvas.on("selection:created", handleSelection);
      canvas.on("selection:updated", handleSelection);
      canvas.on("selection:cleared", () => {
        setSelectedObject(null); // Clear selected object when selection is cleared
        clearSettings(); // Clear all input settings
      });
      // Listen for object modifications (e.g., resizing, moving) and scaling
      canvas.on("object:modified", handleSelection);
      canvas.on("object:scaling", handleSelection);

      canvas?.renderAll(); // Initial render to ensure canvas is up-to-date

      // Cleanup function: remove event listeners when component unmounts or canvas changes
      return () => {
        canvas.off("selection:created", handleSelection);
        canvas.off("selection:updated", handleSelection);
        canvas.off("selection:cleared");
        canvas.off("object:modified", handleSelection);
        canvas.off("object:scaling", handleSelection);
      };
    }
  }, [canvas, clearSettings, handleObjectSelection]); // Dependencies for useEffect

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
              {/* Render settings based on object type */}
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
              {(selectedObject.type === "text" || selectedObject.type === "textbox") && (
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
