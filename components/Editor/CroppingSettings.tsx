import React, { useState, useEffect } from 'react';
// Import Canvas and Rect types from fabric
import { Canvas, Rect, Object as FabricObject } from 'fabric';

// 1. Define a custom interface for your Fabric.js Rect objects that have a 'name' property
// This extends Fabric's Rect type and adds the 'name' property as a string.
interface NamedRect extends Rect {
  name: string;
}

// Define the props interface for the CroppingSettings component
interface CroppingSettingsProps {
  canvas: Canvas | null; // The Fabric.js Canvas instance, can be null initially
  refreshKey: number; // A number to trigger re-renders/updates (from the Cropping component)
}

const CroppingSettings = ({ canvas, refreshKey }: CroppingSettingsProps) => {

  // State to hold the array of custom NamedRect objects that represent frames
  const [frames, setFrames] = useState<NamedRect[]>([]);
  // State to hold the currently selected frame, can be a NamedRect or undefined
  const [selectedFrame, setSelectedFrame] = useState<NamedRect | undefined>();

  // Function to update the list of frames by filtering objects on the canvas
  const updateFrames = () => {
    // Only proceed if the canvas instance is available
    if (canvas) {
      // Get all objects, then filter for those that are Rects and have names starting with "Frame"
      // We now explicitly check if `obj.name` exists and then assert it as `NamedRect`
      const framesFromCanvas: NamedRect[] = canvas.getObjects().filter((obj: FabricObject) => {
        // We are casting `obj` to `NamedRect` temporarily to access `name`
        // The `instanceof Rect` check ensures it's a rectangle
        // The `!!(obj as NamedRect).name` checks if the 'name' property exists and is not null/undefined/empty string
        return (obj instanceof Rect) && !!(obj as NamedRect).name && (obj as NamedRect).name.startsWith("Frame");
      }) as NamedRect[]; // Assert the filtered array is of type NamedRect[]

      setFrames(framesFromCanvas); // Update the frames state

      // If there are frames, set the first one as selected by default
      if (framesFromCanvas.length > 0) {
        setSelectedFrame(framesFromCanvas[0]);
      } else {
        setSelectedFrame(undefined); // No frames, clear selection
      }
    }
  };

  // useEffect hook to call updateFrames whenever canvas or refreshKey changes
  useEffect(() => {
    updateFrames();
  }, [canvas, refreshKey]); // Dependencies array: re-run when canvas or refreshKey changes

  // Handler for when a frame is selected from the dropdown
  const handleFrameSelect = (value: string) => {
    // Find the selected frame from the frames array based on its name
    // The `frame` in `frames.find` is already correctly typed as `NamedRect`
    const selected = frames.find((frame: NamedRect) => frame.name === value);
    setSelectedFrame(selected); // Set the found frame as the selected one

    // If a frame is found, set it as the active object on the Fabric.js canvas
    if (canvas && selected) {
      canvas.setActiveObject(selected);
      canvas.renderAll(); // Re-render the canvas to highlight the active object
    }
  };

  // Function to export the selected frame as a PNG image
  const exportFrameAsPNG = async () => {
    // Do nothing if no frame is selected
    if (!selectedFrame || !canvas) return;

    // Temporarily hide all frames
    frames.forEach((frame: NamedRect) => {
      frame.set("visible", false);
    });

    // Make the selected frame visible and temporarily remove its stroke for clean export
    selectedFrame.set({
      strokeWidth: 0,
      visible: true
    });

    // Generate a Data URL of the canvas content within the selected frame's bounds
    // The width and height must account for the selected frame's scale factors
    const dataURL = canvas.toDataURL({
      left: selectedFrame.left,
      top: selectedFrame.top,
      width: (selectedFrame.width || 0) * (selectedFrame.scaleX || 1),
      height: (selectedFrame.height || 0) * (selectedFrame.scaleY || 1),
      format: "png",
    });

    // Restore the selected frame's stroke width
    selectedFrame.set({
      strokeWidth: 1,
    });

    // Make all frames visible again
    frames.forEach((frame: NamedRect) => {
      frame.set("visible", true);
    });

    canvas.renderAll(); // Re-render the canvas with all frames visible and stroke restored

    try {
      // Convert the base64 Data URL to a Blob
      const fetchResponse = await fetch(dataURL);
      const blob = await fetchResponse.blob();

      // Create FormData to send the image as a file
      const formData = new FormData();
      formData.append('drawing_pic', blob, `${selectedFrame.name}.png`);

      // Make a POST request to your API endpoint
      const response = await fetch('/api/editor', {
        method: 'POST',
        body: formData, // Send as FormData
      });

      // Check if the response was successful
      if (!response.ok) {
        throw new Error('Failed to save drawing'); // Throw an error if not ok
      }

      // Create a temporary download link and click it to download the image
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `${selectedFrame.name}.png`; // Set the download filename
      link.click();

      console.log('Drawing saved successfully'); // Log success
    } catch (error: unknown) { // Type the error as unknown
      if (error instanceof Error) { // Type guard for Error instances
        console.error('Error saving drawing:', error.message);
        // Implement user-facing error message display here
      } else {
        console.error('An unknown error occurred:', error);
      }
    }
  };

  return (
    <div className=''>
      {/* Only render if there are frames available */}
      {frames.length > 0 && (
        <div className='flex flex-col content-bg py-8 px-10 rounded-b items-center justify-center'>
          <label htmlFor="frameSelector" className='text-md font-semibold text-gray-300'>
            Select Frame:
          </label>
          <select
            id="frameSelector"
            value={selectedFrame?.name || ""} // Use optional chaining for selectedFrame
            onChange={(e) => handleFrameSelect(e.target.value)}
            className='block w-full p-2 m-4 text-gray-300 card-bg border border-gray-600 rounded transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value="" disabled>
              Select a frame
            </option>
            {frames.map((frame: NamedRect) => ( // Type frame as NamedRect in map
              <option key={frame.name} value={frame.name}>
                {frame.name}
              </option>
            ))}
          </select>
          <button
            onClick={exportFrameAsPNG}
            className='px-20 py-1 bg-blue-500 text-white rounded transition duration-300 ease-in-out transform hover:bg-blue-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            Export
          </button>
        </div>
      )}
    </div>
  );
};

export default CroppingSettings;
