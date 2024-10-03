// imageGallery.tsx
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import ImageCanvas from "./ImageCanvas";

interface Image {
  url: string;
}

const ImageGallery: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file) => ({
      url: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  return (
    <div className="flex m-5 justify-center">
      <div className="w-[250px] bg-gray-600 p-2 mr-4">
        <div
          {...getRootProps()}
          className="border border-gray-200 p-2 cursor-pointer text-center text-white font-bold uppercase hover:bg-gray-400"
        >
          <input {...getInputProps()} />
          <p>Upload Images</p>
        </div>
        <div className="mt-2 overflow-y-scroll h-[700px]">
          {images.length ? (
            images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={`img-${index}`}
                className="mb-1 cursor-pointer h-[100] w-[150]"
                draggable={true}
                onDragStart={(e) =>
                  e.dataTransfer.setData("imageUrl", image.url)
                }
              />
            ))
          ) : (
            <p className="text-white text-center">No images uploaded</p>
          )}
        </div>
      </div>
      <ImageCanvas images={images} />
    </div>
  );
};

export default ImageGallery;
