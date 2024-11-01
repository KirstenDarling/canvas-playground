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
      <div className="border border-gray-500 w-[1300px] h-[1000px] overflow-y-auto">
        <canvas ref={canvasRef} className="w-full" />
      </div>
    </div>
  );
};

export default ImageCanvas;
