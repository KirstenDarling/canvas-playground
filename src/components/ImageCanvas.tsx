// import React, { useCallback, useEffect, useRef, useState } from "react";
// import * as fabric from "fabric";
// import {
//   BsCrop,
//   BsArrowsFullscreen,
//   BsImage,
//   BsBookHalf,
//   BsGrid3X3GapFill,
// } from "react-icons/bs";
// import { BiText, BiFullscreen, BiExitFullscreen } from "react-icons/bi";
// import { FaImage } from "react-icons/fa";
// import PreviewWindow from "./PreviewWindow";

// import {
//   useCanvas,
//   useCropping,
//   useImageHandling,
//   useTextAdding,
// } from "../hooks/hooks";

// import {
//   createPhotoBookPages,
//   createPhotoPrintPages,
//   createPhotoTilesPages,
// } from "../utils/canvasFunctions";
import React, { useRef } from "react";
import ImageControls from "./ImageControls";

interface ImageCanvasProps {
  images: string[];
  isGalleryVisible: boolean;
  setIsGalleryVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isFullscreen: boolean;
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
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
  onFullscreenToggle: () => void;
}

const ImageCanvas: React.FC<ImageCanvasProps> = ({
  images,
  isGalleryVisible,
  setIsGalleryVisible,
  isFullscreen,
  setIsFullscreen,
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
  onFullscreenToggle,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="relative h-[700px]">
      <ImageControls
        images={images}
        isGalleryVisible={isGalleryVisible}
        setIsGalleryVisible={setIsGalleryVisible}
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        isPhotoBookModalOpen={isPhotoBookModalOpen}
        setIsPhotoBookModalOpen={setIsPhotoBookModalOpen}
        photoBookOptions={photoBookOptions}
        isPhotoPrintModalOpen={isPhotoPrintModalOpen}
        setIsPhotoPrintModalOpen={setIsPhotoPrintModalOpen}
        photoPrintOptions={photoPrintOptions}
        shouldCreatePrint={shouldCreatePrint}
        shouldCreatePhotoBook={shouldCreatePhotoBook}
        isPhotoTilesModalOpen={isPhotoTilesModalOpen}
        setIsPhotoTilesModalOpen={setIsPhotoTilesModalOpen}
        photoTilesOptions={photoTilesOptions}
        shouldCreateTiles={shouldCreateTiles}
        onFullscreenToggle={onFullscreenToggle}
        canvasRef={canvasRef}
      />
      <div className="bg-gray-50 rounded-lg shadow-md p-4 border-gray-300 border-2 w-[1300px] h-[1000px] overflow-y-auto">
        <canvas ref={canvasRef} className="w-full" />

        {/* // {hasPhotoBook && ( */}

        {/* // <PreviewWindow canvasInstanceRef={canvasInstanceRef} /> */}
        {/* // )} */}
      </div>
    </div>
  );
};

export default ImageCanvas;
