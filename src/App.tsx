import React, { useState } from "react";
import ImageGallery from "./components/ImageGallery";
import ImageCanvas from "./components/ImageCanvas";
import PhotoBookModal from "./components/PhotoBookModal";

const App: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [isGalleryVisible, setIsGalleryVisible] = useState(true);
  const [isPhotoBookModalOpen, setIsPhotoBookModalOpen] = useState(false);
  const [photoBookOptions, setPhotoBookOptions] = useState({
    pages: 10,
    size: "8x11",
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

  const handleCreatePhotoBook = () => {
    console.log("Creating photo book with options:", photoBookOptions);
    console.log("Using images:", images);
    setIsPhotoBookModalOpen(false);
  };

  return (
    <div className="flex flex-col m-5 justify-center">
      {/* Photo Book Modal */}
      <PhotoBookModal
        isOpen={isPhotoBookModalOpen}
        onClose={() => setIsPhotoBookModalOpen(false)}
        onCreate={handleCreatePhotoBook}
        options={photoBookOptions}
        onChange={handlePhotoBookChange}
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
      />
    </div>
  );
};

export default App;
