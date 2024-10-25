// src/components/Canvas.tsx
import React, { useState } from "react";
import ImageCanvas from "./ImageCanvas";
import ImageGallery from "./ImageGallery";
import PhotoBookModal from "./PhotoBookModal";
import { useAuth0 } from "@auth0/auth0-react";
import PhotoPrintModal from "./PhotoPrintModal";

const Canvas: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [isGalleryVisible, setIsGalleryVisible] = useState(true);
  const [isPhotoBookModalOpen, setIsPhotoBookModalOpen] = useState(false);
  const [photoBookOptions, setPhotoBookOptions] = useState({
    pages: 10,
    size: "4x6",
  });
  const [isPhotoPrintModalOpen, setIsPhotoPrintModalOpen] = useState(false);
  const [photoPrintOptions, setPhotoPrintOptions] = useState({
    pages: 10,
    size: "4x6",
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

  const handleCreatePhotoBook = () => {
    console.log("Creating photo book with options:", photoBookOptions);
    console.log("Using images:", images);
    setIsPhotoBookModalOpen(false);
  };

  const handleCreatePhotoPrint = () => {
    console.log("Creating photo print with options:", photoBookOptions);
    console.log("Using images:", images);
    setIsPhotoPrintModalOpen(false);
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
          <ImageGallery
            onDrop={handleDrop}
            images={images}
            isVisible={isGalleryVisible}
          />
          <ImageCanvas
            images={images}
            isGalleryVisible={isGalleryVisible}
            setIsGalleryVisible={setIsGalleryVisible}
            isPhotoBookModalOpen={isPhotoBookModalOpen}
            setIsPhotoBookModalOpen={setIsPhotoBookModalOpen}
            photoBookOptions={photoBookOptions}
            onCreatePhotoBook={handleCreatePhotoBook}
            isPhotoPrintModalOpen={isPhotoPrintModalOpen}
            setIsPhotoPrintModalOpen={setIsPhotoPrintModalOpen}
            photoPrintOptions={photoPrintOptions}
            onCreatePhotoPrint={handleCreatePhotoPrint}
          />
        </div>
      )}
    </>
  );
};

export default Canvas;
