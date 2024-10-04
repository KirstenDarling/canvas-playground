import React, { useState } from "react";
import ImageGallery from "./components/ImageGallery";
import ImageCanvas from "./components/ImageCanvas";

const App: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [isGalleryVisible, setIsGalleryVisible] = useState(true);

  const handleDrop = (newImages: any) => {
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  return (
    <div className="flex flex-col m-5 justify-center">
      <ImageGallery
        onDrop={handleDrop}
        images={images}
        isVisible={isGalleryVisible}
      />
      <ImageCanvas
        images={images}
        isGalleryVisible={isGalleryVisible}
        setIsGalleryVisible={setIsGalleryVisible}
      />
    </div>
  );
};

export default App;
