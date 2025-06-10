"use client";

import { useEffect, useId, useRef, useState, useCallback } from "react"; // Added useCallback
import { motion } from "framer-motion";

import { cn } from "@/lib/utils"; // Assuming this utility correctly handles class names

// Define a more specific type for strokeDasharray if it's always a number or string
// Fabric.js typically expects a number or an array of numbers (e.g., [5, 5])
// For SVG pattern path, it's usually just a string or number. Let's assume number | string | number[]
type StrokeDasharray = number | string | number[];

// Interface for the props of the AnimatedGridPattern component
interface AnimatedGridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: StrokeDasharray; // Use the more specific type
  numSquares?: number;
  className?: string;
  maxOpacity?: number;
  duration?: number;
}

// Interface for the shape of a single square in the state
interface Square {
  id: number;
  pos: [number, number]; // Position as an array of [x, y] coordinates
}

export default function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 4,
  repeatDelay = 0.5, // Destructure even if not directly used in the current animation logic
  ...props
}: AnimatedGridPatternProps) {
  const id = useId(); // Unique ID for SVG pattern
  const containerRef = useRef<SVGSVGElement>(null); // Ref for the SVG container
  // State to store the dimensions of the container
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  // State to store the array of animated squares
  const [squares, setSquares] = useState<Square[]>([]); // Initialize with correct type

  // Memoize getPos using useCallback as it depends on `dimensions`
  // This prevents it from being recreated on every render if dimensions don't change
  const getPos = useCallback((): [number, number] => {
    // Ensure dimensions are valid before calculating position
    if (dimensions.width === 0 || dimensions.height === 0) {
      return [0, 0]; // Return a default if dimensions are not yet set
    }
    return [
      Math.floor((Math.random() * dimensions.width) / width),
      Math.floor((Math.random() * dimensions.height) / height),
    ];
  }, [dimensions, width, height]); // Dependencies for useCallback

  // Adjust the generateSquares function to return objects with an id, x, and y
  // Memoize generateSquares as it depends on `getPos`
  const generateSquares = useCallback((count: number): Square[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      pos: getPos(), // Use the memoized getPos
    }));
  }, [getPos]); // Dependency for useCallback

  // Function to update a single square's position
  // Memoize updateSquarePosition
  const updateSquarePosition = useCallback((squareId: number) => {
    setSquares((currentSquares) =>
      currentSquares.map((sq) =>
        sq.id === squareId
          ? {
              ...sq,
              pos: getPos(), // Get a new random position for the square
            }
          : sq,
      ),
    );
  }, [getPos]); // Dependency for useCallback

  // Update squares to animate in when dimensions or numSquares change
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      setSquares(generateSquares(numSquares));
    }
  }, [dimensions, numSquares, generateSquares]); // Added generateSquares to dependencies

  // Resize observer to update container dimensions
  useEffect(() => {
    // 'entry' is a const by default in modern JS (and TS), so no need to redeclare with `let`.
    // The ESLint rule `prefer-const` is correctly applied here.
    const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      for (const entry of entries) { // Changed 'let entry' to 'const entry'
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [containerRef]); // `containerRef` is already stable, but including for clarity if it were mutable

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x={x} y={y} className="overflow-visible">
        {squares.map(({ pos: [squareX, squareY], id: squareId }, index) => ( // Destructure and rename for clarity
          <motion.rect
            initial={{ opacity: 0 }}
            animate={{ opacity: maxOpacity }}
            transition={{
              duration,
              repeat: 1,
              delay: index * 0.1,
              repeatType: "reverse",
            }}
            onAnimationComplete={() => updateSquarePosition(squareId)} // Pass squareId
            key={squareId} // Use unique id for key
            width={width - 1}
            height={height - 1}
            x={squareX * width + 1} // Use renamed squareX
            y={squareY * height + 1} // Use renamed squareY
            fill="currentColor"
            strokeWidth="0"
          />
        ))}
      </svg>
    </svg>
  );
}
