import React, { useCallback, useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import {
  BsCrop,
  BsArrowsFullscreen,
  BsImage,
  BsBookHalf,
  BsGrid3X3GapFill,
} from "react-icons/bs";
import { BiText } from "react-icons/bi";
import { FaImage } from "react-icons/fa";
import {
  useCanvas,
  useCropping,
  useImageHandling,
  useTextAdding,
} from "../hooks/hooks";

import {
  createPhotoBookPages,
  createPhotoPrintPages,
  createPhotoTilesPages,
} from "../utils/canvasFunctions";

interface ImageCanvasProps {
  images: string[];
  isGalleryVisible: boolean;
  setIsGalleryVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPhotoBookModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isPhotoBookModalOpen: boolean;
  photoBookOptions: { pages: number; size: string };
  setIsPhotoPrintModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isPhotoPrintModalOpen: boolean;
  photoPrintOptions: { pages: number; size: string };
  shouldCreatePrint: boolean;
  shouldCreatePhotoBook: boolean;
  isPhotoTilesModalOpen: boolean;
  setIsPhotoTilesModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  photoTilesOptions: { pages: number; size: string };
  shouldCreateTiles: boolean;
}

const ImageCanvas: React.FC<ImageCanvasProps> = ({
  images,
  isGalleryVisible,
  setIsGalleryVisible,
  isPhotoBookModalOpen,
  setIsPhotoBookModalOpen,
  photoBookOptions,
  isPhotoPrintModalOpen,
  setIsPhotoPrintModalOpen,
  photoPrintOptions,
  shouldCreatePrint,
  shouldCreatePhotoBook,
  isPhotoTilesModalOpen,
  setIsPhotoTilesModalOpen,
  photoTilesOptions,
  shouldCreateTiles,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedImage, setSelectedImage] = useState<fabric.Object | null>(
    null
  );
  const canvasInstanceRef = useRef<fabric.Canvas | null>(null);

  const {
    isCropping,
    setIsCropping,
    cropRect,
    setCropRect,
    startCropping,
    cropImage,
  } = useCropping(selectedImage!, canvasInstanceRef);

  const { handleDrop, handleDragOver } = useImageHandling(canvasInstanceRef);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isAddingText, setIsAddingText, addTextToSpine } =
    useTextAdding(canvasInstanceRef);

  const { hasImage, hasPhotoBook } = useCanvas(canvasInstanceRef);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!, {
      width: 1300,
      height: 1000,
      backgroundColor: "#fff",
      selection: true,
    });
    canvasInstanceRef.current = canvas;

    const canvasContainer = canvasRef.current!.parentElement;
    canvasContainer!.addEventListener("drop", handleDrop);
    canvasContainer!.addEventListener("dragover", handleDragOver);

    canvas.on("selection:created", (options: { selected: fabric.Object[] }) => {
      setSelectedImage(options.selected[0]);
    });

    canvas.on("selection:cleared", () => {
      setSelectedImage(null);
      setIsCropping(false);
      setCropRect(null);
    });

    return () => {
      canvasContainer!.removeEventListener("drop", handleDrop);
      canvasContainer!.removeEventListener("dragover", handleDragOver);
      canvas.dispose();
    };
  }, [handleDrop, handleDragOver, setCropRect, setIsCropping]);

  useEffect(() => {
    if (shouldCreatePrint) {
      createPhotoPrintPages(canvasInstanceRef, photoPrintOptions);
    }
    if (shouldCreatePhotoBook) {
      createPhotoBookPages(canvasInstanceRef, photoBookOptions);
    }
    if (shouldCreateTiles) {
      createPhotoTilesPages(canvasInstanceRef, photoTilesOptions);
    }
  }, [
    shouldCreatePrint,
    shouldCreatePhotoBook,
    shouldCreateTiles,
    photoBookOptions,
    photoPrintOptions,
    photoTilesOptions,
  ]);

  const deleteSelectedImage = useCallback(() => {
    if (selectedImage && canvasInstanceRef.current) {
      canvasInstanceRef.current.remove(selectedImage);
      canvasInstanceRef.current.requestRenderAll();
      setSelectedImage(null);
    }
  }, [selectedImage]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.key === "Delete" ||
          event.key === "Backspace" ||
          event.key === "d") &&
        selectedImage
      ) {
        deleteSelectedImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage, deleteSelectedImage]);

  return (
    <div className="relative h-[700px]">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setIsGalleryVisible(!isGalleryVisible)}
          className="bg-purple-400 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-full shadow-sm transition-all duration-200"
        >
          {isGalleryVisible ? "Hide Image Gallery" : "Show Image Gallery"}
          <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-8 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
            {isGalleryVisible ? "Hide Gallery" : "Show Gallery"}
          </span>
        </button>
        <button
          onClick={() => setIsPhotoPrintModalOpen(!isPhotoPrintModalOpen)}
          className="relative p-2 group"
        >
          <FaImage size={20} />
          <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-8 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
            Make Single Photo Print
          </span>
        </button>
        <button
          onClick={() => setIsPhotoBookModalOpen(!isPhotoBookModalOpen)}
          className="relative p-2 group"
        >
          <BsBookHalf size={20} />
          <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-8 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
            Make Photo Book
          </span>
        </button>
        <button
          onClick={() => setIsPhotoTilesModalOpen(!isPhotoTilesModalOpen)}
          className="relative p-2 group"
        >
          <BsGrid3X3GapFill size={20} />
          <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-8 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
            Make Photo Tiles
          </span>
        </button>
        <button
          onClick={startCropping}
          disabled={!selectedImage || isCropping || hasImage}
          className={`relative p-2 group 
            ${
              !selectedImage || isCropping || hasImage
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
        >
          <BsCrop size={20} />
          <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-8 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
            Crop Image
          </span>
        </button>
        <button
          onClick={cropImage}
          disabled={!cropRect || hasImage}
          className={`relative p-2 group 
            ${!cropRect || hasImage ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <BsArrowsFullscreen size={20} />
          <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-8 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
            Finalize Crop
          </span>
        </button>
        <button
          onClick={() => {
            if (selectedImage instanceof fabric.Image) {
              selectedImage.set("flipX", !selectedImage.flipX);
              canvasInstanceRef.current!.requestRenderAll();
            }
          }}
          disabled={!selectedImage || hasImage}
          className={`relative p-2 group 
            ${
              !selectedImage || hasImage ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          <BsImage size={20} className="transform rotate-y-180" />
          <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-8 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
            Flip Horizontal
          </span>
        </button>
        <button
          onClick={() => {
            if (selectedImage instanceof fabric.Image) {
              selectedImage.set("flipY", !selectedImage.flipY);
              canvasInstanceRef.current!.requestRenderAll();
            }
          }}
          disabled={!selectedImage || hasImage}
          className={`relative p-2 group
            ${
              !selectedImage || hasImage ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          <BsImage size={20} className="transform rotate-x-180" />
          <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-8 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
            Flip Vertical
          </span>
        </button>
        <button
          onClick={addTextToSpine}
          disabled={isAddingText || !hasPhotoBook}
          className={`relative p-2 group 
            ${
              isAddingText || !hasPhotoBook
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
        >
          <BiText size={20} />
          <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-8 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
            Add Text
          </span>
        </button>
      </div>
      <div className="border border-gray-500 w-[1300px] h-[1000px] overflow-y-auto">
        <canvas ref={canvasRef} className="w-full" />
      </div>
    </div>
  );
};

export default ImageCanvas;
