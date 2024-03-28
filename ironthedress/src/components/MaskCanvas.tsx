"use client";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useDraw } from "./useDraw";

const MaskCanvas = ({ inputImageBase64, setOutputImage, setLoading }: { inputImageBase64: string, setOutputImage: Dispatch<SetStateAction<string>>, setLoading: Dispatch<React.SetStateAction<boolean>> }) => {
  const [maskSaved, setMaskSaved] = useState(false);
  const [mask, setMask] = useState<string>("");
  const { canvasRef, onMouseDown } = useDraw(drawLine)

  function drawLine({ prevPoint, current, ctx }: Draw) {
    const { x: currX, y: currY } = current;
    const lineColor = ' #ffe400';
    const lineWidth = 50;

    if (!prevPoint) return; // Ensure there's a previous point

    const startPoint = prevPoint;

    // Calculate the distance between the current point and the previous point
    const distance = Math.sqrt(Math.pow(currX - startPoint.x, 2) + Math.pow(currY - startPoint.y, 2));
    const angle = Math.atan2(currY - startPoint.y, currX - startPoint.x);
    const spacing = 5; // Adjust for smoother or rougher curves

    // This loop interpolates points between the previous and current points
    // to ensure a smoother curve.
    for (let i = 0; i < distance; i += spacing) {
      const x = startPoint.x + Math.cos(angle) * i;
      const y = startPoint.y + Math.sin(angle) * i;

      // Drawing a circle at each interpolated point for a smoother line
      ctx.beginPath();
      ctx.arc(x, y, lineWidth / 2, 0, Math.PI * 2);
      ctx.fillStyle = lineColor;
      ctx.fill();
    }
  }

  const modifyCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data; // the pixel data

        // Loop through all pixels
        for (let i = 0; i < data.length; i += 4) {
          // data[i] = red, data[i + 1] = green, data[i + 2] = blue, data[i + 3] = alpha
          if (data[i] == 255 || data[i + 1] == 228 || data[i + 2] == 0) { // If the pixel is drawing color
            // Change to white
            data[i] = 255; // red
            data[i + 1] = 255; // green
            data[i + 2] = 255; // blue
          } else {
            // Change to black
            data[i] = 0; // red
            data[i + 1] = 0; // green
            data[i + 2] = 0; // blue
          }
        }

        // Write the modified pixels back to the canvas
        ctx.putImageData(imageData, 0, 0);
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!inputImageBase64) return;
    modifyCanvas();
    const canvas = canvasRef.current;
    const imageMask = canvas?.toDataURL('image/png').replace('data:', '').replace(/^.+,/, '');
    setMaskSaved(true);
    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input_image: inputImageBase64, mask_image: imageMask }),
      });

      const data = await response.json();
      setOutputImage(data.output_base64);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      const image = new Image();
      image.onload = () => {
        ctx.drawImage(image, 0, 0, canvas!.width, canvas!.height);
      };

      image.src = `data:image/png;base64,${inputImageBase64}`
    }
  }, [canvasRef]);

  if (maskSaved) {
    return (<></>)
  }
  return (
    <div className="flex flex-col justify-center items-center w-fit mx-auto mt-14">
      <canvas
        onMouseDown={onMouseDown}
        ref={canvasRef}
        width={500}
        height={500}
        className="rounded-xl"
      />
      <button className="bg-black font-bold text-white rounded-md px-4 py-2 mx-auto mt-10 w-fit" onClick={() => {
        handleSubmit();
      }}>Submit</button>
    </div>
  )
}

export default MaskCanvas;

