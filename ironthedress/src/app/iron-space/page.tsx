"use client"
import React, { useRef } from 'react'
import { useState } from 'react';
import Img from 'next/image';
import { FilesetResolver, ImageSegmenter } from '@mediapipe/tasks-vision';
import MaskCanvas from '@/components/MaskCanvas';

function base64ToBlob(base64String: string) {
  const byteCharacters = atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: 'image/jpeg' });
}

const legendColors = [
  [255, 197, 0, 255], // Vivid Yellow
  [128, 62, 117, 255], // Strong Purple
  [255, 104, 0, 255], // Vivid Orange
  [166, 189, 215, 255], // Very Light Blue
  [193, 0, 32, 255], // Vivid Red
  [206, 162, 98, 255], // Grayish Yellow
  [129, 112, 102, 255], // Medium Gray
  [0, 125, 52, 255], // Vivid Green
  [246, 118, 142, 255], // Strong Purplish Pink
  [0, 83, 138, 255], // Strong Blue
  [255, 112, 92, 255], // Strong Yellowish Pink
  [83, 55, 112, 255], // Strong Violet
  [255, 142, 0, 255], // Vivid Orange Yellow
  [179, 40, 81, 255], // Strong Purplish Red
  [244, 200, 0, 255], // Vivid Greenish Yellow
  [127, 24, 13, 255], // Strong Reddish Brown
  [147, 170, 0, 255], // Vivid Yellowish Green
  [89, 51, 21, 255], // Deep Yellowish Brown
  [241, 58, 19, 255], // Vivid Reddish Orange
  [35, 44, 22, 255], // Dark Olive Green
  [0, 161, 194, 255] // Vivid Blue
];

const IronSpace = () => {
  const [inputImage, setInputImage] = useState<string>("");
  const [customMaskOption, setCustomMaskOption] = useState(false);
  const [loading, setLoading] = useState(false);
  const [outputImage, setOutputImage] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef(null);

  const handleInputImage = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        //@ts-ignore
        const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
        setInputImage(base64String);
      }
      reader.readAsDataURL(file);
    }

  };

  const handleSubmit = async () => {
    let imageMaskBase64: string = "";
    const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm');

    const imageSegmenter = await ImageSegmenter.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite',
        delegate: "CPU"
      },
      outputCategoryMask: true,
      outputConfidenceMasks: false,
      runningMode: "IMAGE"
    });

    if (imgRef.current && canvasRef.current) {
      imageSegmenter.segment(imgRef.current, (result) => {
        //@ts-ignore
        const canvas: HTMLCanvasElement = document.getElementById("canvas");
        //@ts-ignore
        const img: HTMLImageElement = document.getElementById("img");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx!.clearRect(0, 0, canvas.width, canvas.height);
        ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);

        //@ts-ignore
        const { width, height } = result.categoryMask;
        let imageData = ctx!.getImageData(0, 0, width, height).data;

        canvas.width = width;
        canvas.height = height;
        //@ts-ignore
        const mask = result.categoryMask.getAsUint8Array();
        for (let i = 0; i <= mask.length; i++) {
          const legendColor = legendColors[mask[i] % legendColors.length]; // getting the color set for the segmented part
          if (mask[i] % legendColors.length == 4) {
            imageData[i * 4] = 255; // Red 
            imageData[i * 4 + 1] = 255; // Green
            imageData[i * 4 + 2] = 255; // Blue
            imageData[i * 4 + 3] = 255; // Alpha

          } else {
            mask[i] = 0;
            imageData[i * 4] = 0; // Red 
            imageData[i * 4 + 1] = 0; // Green
            imageData[i * 4 + 2] = 0; // Blue
            imageData[i * 4 + 3] = 0; // Alpha
          }
        }
        const uint8Array = new Uint8ClampedArray(imageData.buffer);
        const dataNew = new ImageData(uint8Array, width, height);
        ctx!.putImageData(dataNew, 0, 0);
        imageMaskBase64 = canvas.toDataURL("image/png").replace('data:', '').replace(/^.+,/, '');
      });
    }

    console.log(imageMaskBase64);
    if (!inputImage || !imageMaskBase64) return;
    setLoading(true);
    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input_image: inputImage, mask_image: imageMaskBase64 }),
      });

      const data = await response.json();
      setOutputImage(data.output_base64);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = base64ToBlob(outputImage!);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'image.jpg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className='flex flex-col min-h-screen mt-20'>
      <h1 className='text-6xl uppercase font-black text-center'>Iron The Dress</h1>
      <div className='flex flex-col justify-between items-center outline-dashed outline-gray-200 outline-2 px-32 w-1/2 mx-auto mt-10 py-10'>
        {outputImage ? (
          <div className='flex items-center justify-center gap-5'>
            <Img src={`data:image/png;base64,${inputImage}`} alt="Input Image" width={300} height={500} />
            <Img src={`data:image/png;base64,${outputImage}`} alt="Output Image" width={300} height={500} />
          </div>
        ) :
          loading ? (
            <div role="status">
              <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )
            :
            (
              <div className='flex flex-col gap-2'>
                <div className="grid w-full max-w-xs items-center gap-1.5">
                  <label className="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Image</label>
                  <input id="picture" type="file" className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium" onChange={handleInputImage} />
                </div>
                <div className="grid w-full max-w-xs items-center gap-1.5">
                  <label htmlFor="customMaskOption" className="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Masking Options</label>
                  <select
                    id="customMaskOption"
                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
                    onChange={(e) => setCustomMaskOption(e.target.value === 'true')}
                    value={customMaskOption.toString()}
                  >
                    <option value="false">AI Region Selector</option>
                    <option value="true">Manually Select Region</option>
                  </select>
                </div>
                <canvas ref={canvasRef} id="canvas" className='hidden'></canvas>
                <img
                  src={`data:image/png;base64,${inputImage}`}
                  id='img'
                  ref={imgRef}
                  alt="Img"
                  className='hidden'
                />
                {
                  !customMaskOption && inputImage &&
                  <>
                    <button type="submit" className="bg-black mx-auto text-white font-bold py-2 px-4 rounded" onClick={handleSubmit}>
                      Submit
                    </button>
                  </>
                }
                {
                  customMaskOption && inputImage &&
                  <MaskCanvas inputImageBase64={inputImage} setLoading={setLoading} setOutputImage={setOutputImage} />
                }
              </div>
            )
        }
      </div>
      {
        outputImage &&
        <button onClick={handleDownload} className='mt-5 w-fit mx-auto bg-black text-white px-4 py-3 rounded-lg'>Download Output</button>
      }
    </main>
  )
}

export default IronSpace
