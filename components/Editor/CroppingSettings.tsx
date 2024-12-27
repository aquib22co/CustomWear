import { format } from 'path';
import React,{useState,useEffect} from 'react'

const CroppingSettings = ({canvas,refreshKey}:any) => {

    const [frames,setFrames] = useState([]);
    const [selectedFrame,setSelectedFrame] = useState<any>();

    const updateFrames = () => {
        if(canvas){
            const framesFromCanvas = canvas.getObjects("rect").filter((obj:any)=>{
                return obj.name && obj.name.startsWith("Frame");
            })

            setFrames(framesFromCanvas);

            if(framesFromCanvas.length > 0){
                setSelectedFrame(framesFromCanvas[0]);
            }
        }
    }
    useEffect(()=>{
        updateFrames();
    },[canvas,refreshKey]);

    const handleFrameSelect = (value : any) => {
        const selected = frames.find((frame:any) => frame.name === value);
        setSelectedFrame(selected);
        canvas.setActiveObject(selected);
        canvas.renderAll();
    }

    const exportFrameAsPNG = () => {
        if(!selectedFrame) return;

        frames.forEach((frame:any)=> {
            frame.set("visible",false);
        })

        selectedFrame.set({
            strokeWidth : 0,
            visible : true
        })

        const dataURL = canvas.toDataURL({
            left : selectedFrame.left,
            top : selectedFrame.top,
            width : selectedFrame.width * selectedFrame.scaleX,
            height : selectedFrame.height * selectedFrame.scaleY,
            format : "png",
        })

        selectedFrame.set({
            strokeWidth : 1,
        })

        frames.forEach((frame:any)=> {
            frame.set("visible",true);
        })

        canvas.renderAll();

        const link = document.createElement("a");
        link.href = dataURL
        link.download = `${selectedFrame.name}.png`;
        link.click();
    }


  return (
    <div className='text-white'>
      {frames.length > 0 && (
        <>
          <label htmlFor="frameSelector">Select Frame:</label>
          <select
            id="frameSelector"
            value={selectedFrame?.name || ""}
            onChange={(e) => handleFrameSelect(e.target.value)}
            className='text-black'
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
          <button onClick={exportFrameAsPNG}>Export as PNG</button>
        </>
      )}
    </div>
  )
}

export default CroppingSettings