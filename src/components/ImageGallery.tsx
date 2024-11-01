import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface ImageGalleryProps {
  onDrop: (acceptedFiles: File[]) => void;
  images: string[];
  isVisible: boolean;
}

export default function ImageGallery(props: ImageGalleryProps) {
  const [images, setImages] = useState(props.images);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newImages = acceptedFiles.map((file) => URL.createObjectURL(file));
      setImages((prevImages) => [...prevImages, ...newImages]);
      props.onDrop(acceptedFiles);
      setIsModalOpen(false);
    },
    [props.onDrop]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: { "image/*": [] },
  });

  return (
    <div
      className={`w-full bg-slate-400-200 mb-[20px] p-4 rounded-md shadow-md transition-all duration-300 ${
        props.isVisible ? "block" : "hidden"
      }`}
    >
      {/* Upload Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-purple-500 hover:bg-purple-700 text-white font-medium py-1.5 px-3 rounded-md shadow-md transition-all duration-200"
      >
        Add Images
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md">
            <h2 className="text-xl font-bold mb-4">Upload Images</h2>
            <div
              {...getRootProps()}
              className="bg-blue-200 hover:bg-blue-300 text-gray-700 font-medium py-2 px-4 rounded-md shadow-sm transition-all duration-200 text-center"
            >
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 px-4 py-2 bg-gray-300 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Image List */}
      <div className="flex flex-row gap-3 overflow-x-scroll h-[150px] mt-4">
        {images.length ? (
          images.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`img-${index}`}
              className="cursor-pointer h-[100px] rounded-md shadow-sm"
              draggable={true}
              onDragStart={(e) => e.dataTransfer.setData("imageUrl", url)}
            />
          ))
        ) : (
          <p className="text-white text-center">There are no images</p>
        )}
      </div>
    </div>
  );
}
