import { Canvas, Object as FabricObject, Line, ILineOptions } from 'fabric'; // Import necessary types

// Define the snapping distance constant
const snappingDist = 10;

/**
 * Handles the logic for snapping objects to canvas edges, center, and
 * displaying temporary guidelines during an object's 'moving' event.
 *
 * @param canvas The Fabric.js Canvas instance.
 * @param obj The Fabric.js object currently being moved.
 * @param guidelines The current state array of guideline Fabric.js Line objects.
 * @param setGuidelines A React setState function to update the guidelines state.
 */
export const handleObjectMoving = (
  canvas: Canvas,
  obj: FabricObject, // obj is a FabricObject with common properties like left, top, etc.
  guidelines: Line[], // guidelines state is an array of Fabric.js Line objects
  setGuidelines: React.Dispatch<React.SetStateAction<Line[]>> // setGuidelines is a React setter for Line[]
) => {
  const canvasWidth = canvas.width || 0; // Ensure width is a number, default to 0
  const canvasHeight = canvas.height || 0; // Ensure height is a number, default to 0

  // Calculate object's current position and dimensions, accounting for scale
  const left = obj.left || 0;
  const top = obj.top || 0;
  const objectWidth = (obj.width || 0) * (obj.scaleX || 1);
  const objectHeight = (obj.height || 0) * (obj.scaleY || 1);
  const right = left + objectWidth;
  const bottom = top + objectHeight;
  const centerX = left + objectWidth / 2;
  const centerY = top + objectHeight / 2;

  // Use const for newGuidelines as it's only pushed to, not reassigned.
  // The 'prefer-const' ESLint rule is satisfied by this change.
  const newGuidelines: Line[] = [];
  clearGuidelines(canvas); // Clear existing guidelines from the canvas

  let snapped = false; // Flag to indicate if snapping occurred

  // Snap to left edge
  if (Math.abs(left) < snappingDist) {
    obj.set({ left: 0 });
    if (!guidelineExist(canvas, "vertical-left")) {
      const line = createVerticalGuideline(canvas, 0, "vertical-left");
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  // Snap to top edge
  if (Math.abs(top) < snappingDist) {
    obj.set({ top: 0 });
    if (!guidelineExist(canvas, "horizontal-top")) {
      const line = createHorizontalGuideline(canvas, 0, "horizontal-top");
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  // Snap to right edge
  if (Math.abs(right - canvasWidth) < snappingDist) {
    obj.set({ left: canvasWidth - objectWidth });
    if (!guidelineExist(canvas, "vertical-right")) {
      const line = createVerticalGuideline(
        canvas,
        canvasWidth,
        "vertical-right"
      );
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  // Snap to bottom edge
  if (Math.abs(bottom - canvasHeight) < snappingDist) {
    obj.set({ top: canvasHeight - objectHeight });
    if (!guidelineExist(canvas, "horizontal-bottom")) {
      const line = createHorizontalGuideline(canvas, canvasHeight, "horizontal-bottom");
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  // Snap to horizontal center
  if (Math.abs(centerX - canvasWidth / 2) < snappingDist) {
    obj.set({ left: (canvasWidth / 2) - (objectWidth / 2) });
    if (!guidelineExist(canvas, "vertical-center")) {
      const line = createVerticalGuideline(
        canvas,
        canvasWidth / 2,
        "vertical-center"
      );
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  // Snap to vertical center
  if (Math.abs(centerY - canvasHeight / 2) < snappingDist) {
    obj.set({ top: (canvasHeight / 2) - (objectHeight / 2) });
    // Note: The original code used "vertical-center" here, which is incorrect for a horizontal line.
    // Changed to "horizontal-center" and confirmed logic for horizontal guideline.
    if (!guidelineExist(canvas, "horizontal-center")) {
      const line = createHorizontalGuideline(
        canvas,
        canvasHeight / 2, // Use canvasHeight for horizontal line center
        "horizontal-center"
      );
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  // If no snapping occurred, clear guidelines from previous move events that might still be present
  if (!snapped) {
    clearGuidelines(canvas);
  } else {
    // Update the state with the newly added guidelines
    setGuidelines(newGuidelines);
  }

  canvas.renderAll(); // Re-render the canvas to show/update guidelines
};

/**
 * Creates a vertical guideline line on the canvas.
 * @param canvas The Fabric.js Canvas instance.
 * @param x The x-coordinate for the vertical line.
 * @param id A unique identifier for the guideline (e.g., "vertical-left").
 * @returns The created Fabric.js Line object.
 */
export const createVerticalGuideline = (canvas: Canvas, x: number, id: string): Line => {
  return new Line([x, 0, x, canvas.height || 0], {
    name: id, // Using 'name' property for identification, as 'id' is not a standard Fabric property for all objects but can be added.
    stroke: "red",
    strokeWidth: 1,
    selectable: false, // Guidelines should not be selectable
    evented: false,    // Guidelines should not trigger events
    strokeDashArray: [5, 5], // Dashed line style
    opacity: 0.8,
  } as ILineOptions & { name?: string }); // Cast to ILineOptions and allow for a 'name' property
};

/**
 * Creates a horizontal guideline line on the canvas.
 * @param canvas The Fabric.js Canvas instance.
 * @param y The y-coordinate for the horizontal line.
 * @param id A unique identifier for the guideline (e.g., "horizontal-top").
 * @returns The created Fabric.js Line object.
 */
export const createHorizontalGuideline = (canvas: Canvas, y: number, id: string): Line => {
  return new Line([0, y, canvas.width || 0, y], {
    name: id, // Using 'name' for identification
    stroke: "red",
    strokeWidth: 1,
    selectable: false,
    evented: false,
    strokeDashArray: [5, 5],
    opacity: 0.8,
  } as ILineOptions & { name?: string }); // Cast to ILineOptions and allow for a 'name' property
};

/**
 * Clears all existing guidelines from the canvas.
 * Guidelines are identified by their 'name' property starting with "vertical-" or "horizontal-".
 * @param canvas The Fabric.js Canvas instance.
 */
export const clearGuidelines = (canvas: Canvas) => {
  // Get all objects, then filter for lines that are guidelines
  const guidelinesToRemove = canvas.getObjects().filter((obj: FabricObject) => {
    return (obj instanceof Line) && ((obj.name && obj.name.startsWith("vertical-")) || (obj.name && obj.name.startsWith("horizontal-")));
  }) as Line[]; // Assert the filtered array is of type Line[]

  guidelinesToRemove.forEach((line: Line) => {
    canvas.remove(line); // Remove each identified guideline
  });
  canvas.renderAll(); // Re-render the canvas after removing objects
};

/**
 * Checks if a guideline with a given ID already exists on the canvas.
 * @param canvas The Fabric.js Canvas instance.
 * @param id The unique identifier of the guideline to check.
 * @returns True if a guideline with the given ID exists, false otherwise.
 */
const guidelineExist = (canvas: Canvas, id: string): boolean => {
  // Filter all objects to find lines that match the given ID by their 'name' property
  return canvas.getObjects().some((obj: FabricObject) => {
    return (obj instanceof Line) && obj.name === id;
  });
};
