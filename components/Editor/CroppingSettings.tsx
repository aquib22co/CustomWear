import { format } from 'path';
import React, { useState, useEffect } from 'react'

const CroppingSettings = ({ canvas, refreshKey }: any) => {

  const [frames, setFrames] = useState([]);
  const [selectedFrame, setSelectedFrame] = useState<any>();

  const updateFrames = () => {
    if (canvas) {
      const framesFromCanvas = canvas.getObjects("rect").filter((obj: any) => {
        return obj.name && obj.name.startsWith("Frame");
      })

      setFrames(framesFromCanvas);

      if (framesFromCanvas.length > 0) {
        setSelectedFrame(framesFromCanvas[0]);
      }
    }
  }
  useEffect(() => {
    updateFrames();
  }, [canvas, refreshKey]);

  const handleFrameSelect = (value: any) => {
    const selected = frames.find((frame: any) => frame.name === value);
    setSelectedFrame(selected);
    canvas.setActiveObject(selected);
    canvas.renderAll();
  }

  const exportFrameAsPNG = () => {
    if (!selectedFrame) return;

    frames.forEach((frame: any) => {
      frame.set("visible", false);
    })

    selectedFrame.set({
      strokeWidth: 0,
      visible: true
    })

    const dataURL = canvas.toDataURL({
      left: selectedFrame.left,
      top: selectedFrame.top,
      width: selectedFrame.width * selectedFrame.scaleX,
      height: selectedFrame.height * selectedFrame.scaleY,
      format: "png",
    })

    selectedFrame.set({
      strokeWidth: 1,
    })

    frames.forEach((frame: any) => {
      frame.set("visible", true);
    })

    canvas.renderAll();

    const link = document.createElement("a");
    link.href = dataURL
    link.download = `${selectedFrame.name}.png`;
    link.click();
  }


  return (
    <div className=''>
      {frames.length > 0 && (
        <div className='flex flex-col content-bg py-8 px-10 rounded-b items-center justify-center'>
          <label htmlFor="frameSelector" className='text-md font-semibold text-gray-300'>
            Select Frame:
          </label>
          <select
            id="frameSelector"
            value={selectedFrame?.name || ""}
            onChange={(e) => handleFrameSelect(e.target.value)}
            className='block w-full p-2 m-4 text-gray-300 card-bg border border-gray-600 rounded transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value="" disabled>
              Select a frame
            </option>
            {frames.map((frame: any) => (
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
  )
}

export default CroppingSettings