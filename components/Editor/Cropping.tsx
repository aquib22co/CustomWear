import React from 'react';
import { Rect, Canvas, Object as FabricObject } from 'fabric'; // Import Canvas and Object from fabric
import { Crop } from 'lucide-react';

// 1. Define the props interface for the Cropping component
interface CroppingProps {
  canvas: Canvas | null; // The Fabric.js Canvas instance or nulli
  onFrameUpdate: () => void; // A function that takes no arguments and returns nothing
}

const Cropping = ({ canvas, onFrameUpdate }: CroppingProps) => {

    // Function to add a new cropping frame (rectangle) to the canvas
    const addFrameToCanvas = () => {
        // Calculate a unique name for the new frame based on existing rectangles
        const frameName = `Frame ${canvas.getObjects("rect").length + 1}`;

        // Create a new Fabric.js Rect object for the frame
        const frame = new Rect({
            left: 100,             // Initial left position
            top: 100,              // Initial top position
            width: 200,            // Initial width
            height: 200,           // Initial height
            fill: "transparent",   // No fill color, so objects underneath are visible
            stroke: "#07FE3D",     // Green stroke color for visibility
            strokeWidth: 1,        // Initial stroke width
            selectable: true,      // Allow the frame to be selected and transformed
            evented: true,         // Enable Fabric.js events on this object
            name: frameName        // Assign the unique name
        });

        // Add the newly created frame to the canvas
        canvas.add(frame);
        // Render all objects on the canvas to display the new frame
        canvas.renderAll();

        // 2. Define the type for the 'object' parameter in maintainStrokeWidth
        // This function ensures the stroke width remains constant regardless of scaling.
        const maintainStrokeWidth = (object: FabricObject) => {
            // Get the current scale factors for x and y axes
            const scaleX = object.scaleX || 1;
            const scaleY = object.scaleY || 1;

            // Update the object's width, height, and reset scale factors
            // This effectively "bakes" the scaling into the width/height
            // and maintains the visual strokeWidth.
            object.set({
                width: object.width * scaleX,
                height: object.height * scaleY,
                scaleX: 1, // Reset scaleX to 1
                scaleY: 1, // Reset scaleY to 1
                strokeWidth: 1, // Keep strokeWidth at a fixed value (e.g., 1)
            });

            // Update the object's coordinates (bounding box and controls)
            // This is crucial after manual transformations or property changes
            object.setCoords();
        };

        // Attach an event listener for when the frame is being scaled
        frame.on("scaling", () => {
            maintainStrokeWidth(frame); // Apply stroke width maintenance
            canvas.renderAll();         // Re-render the canvas
        });

        // Attach an event listener for when the frame's transformation is modified (e.g., scaled, moved)
        frame.on("modified", () => {
            maintainStrokeWidth(frame); // Apply stroke width maintenance
            canvas.renderAll();         // Re-render the canvas
        });

        // Call the parent component's callback to indicate that a frame has been updated/added
        onFrameUpdate();
    };

    return (
        <div className='text-white'>
            {/* Button to trigger adding a new frame */}
            <button
                onClick={addFrameToCanvas}
                className="p-2 rounded-md hover:bg-gray-700 transition-colors" // Added some basic Tailwind styling
            >
                <Crop className='text-white' size={24} /> {/* Lucide-react icon */}
            </button>
        </div>
    );
};

export default Cropping;
