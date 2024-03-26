"use client"
import Image from 'next/image';
import { useState } from 'react';

export default function Generate() {
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form onSubmit={handleSubmit}>
        <label htmlFor='input_image'>Input Image</label>
        <input id='input_image' type="file" accept="image/*" onChange={handleInputImage} />
        <label htmlFor='mask_image'>Mask Image</label>
        <input type="file" accept="image/*" onChange={handleMaskImage} />
        <button type="submit">Upload</button>
      </form>
      {}
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
  );
}