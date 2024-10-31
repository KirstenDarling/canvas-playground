import React, { useState } from "react";
import ImageCanvas from "./ImageCanvas";
import ImageGallery from "./ImageGallery";
import PhotoBookModal from "./PhotoBookModal";
import { useAuth0 } from "@auth0/auth0-react";
import PhotoPrintModal from "./PhotoPrintModal";
import PhotoTilesModal from "./PhotoTilesModal";

const Canvas: React.FC<{ onFullscreenToggle: () => void }> = ({
  onFullscreenToggle,
}) => {
  const [images, setImages] = useState<any[]>([]);
  const [shouldCreatePrint, setShouldCreatePrint] = useState<boolean>(false);
  const [shouldCreatePhotoBook, setShouldCreatePhotoBook] =
    useState<boolean>(false);
  const [shouldCreateTiles, setShouldCreateTiles] = useState<boolean>(false);
  const [isGalleryVisible, setIsGalleryVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPhotoBookModalOpen, setIsPhotoBookModalOpen] = useState(false);
  const [photoBookOptions, setPhotoBookOptions] = useState({
    pages: 10,
    size: "4x6",
  });
  const [isPhotoPrintModalOpen, setIsPhotoPrintModalOpen] = useState(false);
  const [photoPrintOptions, setPhotoPrintOptions] = useState({
    pages: 1,
    size: "4x6",
  });
  const [isPhotoTilesModalOpen, setIsPhotoTilesModalOpen] = useState(false);
  const [photoTilesOptions, setPhotoTilesOptions] = useState({
    pages: 6,
    size: "8x8",
  });

  const handleDrop = (newImages: any) => {
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handlePhotoBookChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setPhotoBookOptions({ ...photoBookOptions, [name]: value });
  };

  const handlePhotoPrintChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setPhotoPrintOptions({ ...photoPrintOptions, [name]: value });
  };

  const handlePhotoTilesChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setPhotoTilesOptions({ ...photoTilesOptions, [name]: value });
  };

  const handleCreatePhotoBook = (options: { pages: number; size: string }) => {
    setShouldCreatePhotoBook(true);
    setShouldCreatePrint(false);
    setShouldCreateTiles(false);
    setIsPhotoBookModalOpen(false);
  };

  const handleCreatePhotoPrint = (options: { pages: number; size: string }) => {
    setShouldCreatePrint(true);
    setShouldCreatePhotoBook(false);
    setShouldCreateTiles(false);
    setIsPhotoPrintModalOpen(false);
  };

  const handleCreatePhotoTiles = (options: { pages: number; size: string }) => {
    setShouldCreateTiles(true);
    setShouldCreatePhotoBook(false);
    setShouldCreatePrint(false);
    setIsPhotoTilesModalOpen(false);
  };

  const { isAuthenticated, isLoading } = useAuth0();

  return (
    <>
      {!isLoading && isAuthenticated && (
        <div>
          <PhotoBookModal
            isOpen={isPhotoBookModalOpen}
            onClose={() => setIsPhotoBookModalOpen(false)}
            onCreate={handleCreatePhotoBook}
            options={photoBookOptions}
            onChange={handlePhotoBookChange}
          />
          <PhotoPrintModal
            isOpen={isPhotoPrintModalOpen}
            onClose={() => setIsPhotoPrintModalOpen(false)}
            onCreate={handleCreatePhotoPrint}
            options={photoPrintOptions}
            onChange={handlePhotoPrintChange}
          />
          <PhotoTilesModal
            isOpen={isPhotoTilesModalOpen}
            onClose={() => setIsPhotoTilesModalOpen(false)}
            onCreate={handleCreatePhotoTiles}
            options={photoTilesOptions}
            onChange={handlePhotoTilesChange}
          />
          <ImageGallery
            onDrop={handleDrop}
            images={images}
            isVisible={isGalleryVisible}
          />
          <ImageCanvas
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
          />
        </div>
      )}
    </>
  );
};

export default Canvas;
