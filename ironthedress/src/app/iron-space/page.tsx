"use client"
import React from 'react'
import { useState } from 'react';
import Image from 'next/image';
import { UrlBuilder } from '@bytescale/sdk';
import Header from '../../components/header'
import { UploadDropzone } from "@bytescale/upload-widget-react";

const IronSpace = () => {
  const [inputImage, setInputImage] = useState(null);
  const [maskImage, setMaskImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [outputImage, setOutputImage] = useState(null);

  const handleInputImage = (e:any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        //@ts-ignore
        const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
        setInputImage(base64String);
        console.log(inputImage)
      }
      reader.readAsDataURL(file);
    }

  };

  const handleMaskImage = (e:any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        //@ts-ignore
        const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
        setMaskImage(base64String);
      }
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e:any) => {
    setLoading(true);
    e.preventDefault();
    if (!inputImage || !maskImage) return;

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input_image: inputImage, mask_image: maskImage }),
      });

      const data = await response.json();
      setOutputImage(data.output_base64);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <main className='bg-black flex flex-col min-h-screen'>
      <Header/>
      <h1 className='text-base flex font-mono justify-center'>Upload your Image and mask</h1>
      <div className=' px-4 mx-auto py-10'>
        <div className="grid w-full max-w-xs items-center gap-1.5">
          <label className="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Image</label>
          <input id="picture" type="file" className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium" onChange={handleInputImage} />
        </div>
        
        <div className="grid w-full max-w-xs items-center gap-1.5 py-5">
          <label className="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Mask</label>
          <input id="picture" type="file" className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium" onChange={handleMaskImage}/>
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onSubmit={handleSubmit}>
            Submit
          </button>
      </div>
      {outputImage ? (
        <div>
          <label>Output Image</label>
          <Image src={`data:image/png;base64,${outputImage}`} alt="Output Image" width={500} height={500} />
        </div>
      ):
      loading && (
        <p>{`Generating Image (this may take approx 2 min)...`}</p>
      )
      }
        
    </main>
  )
}

export default IronSpace
