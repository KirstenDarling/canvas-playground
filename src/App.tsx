import React, { useState, useCallback, useRef, useEffect } from "react";
import ImageGallery from "./components/ImageGallery";
import ImageCanvas from "./components/ImageCanvas";

const App: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [isGalleryVisible, setIsGalleryVisible] = useState(true);
  const [isPhotoBookModalOpen, setIsPhotoBookModalOpen] = useState(false);
  const [photoBookOptions, setPhotoBookOptions] = useState({
    pages: 10, // Default number of pages
    size: "8x11", // Default size
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
    // Here you would handle the logic to create the photo book
    // using the images and photoBookOptions
    console.log("Creating photo book with options:", photoBookOptions);
    console.log("Using images:", images);
    setIsPhotoBookModalOpen(false);
  };

  return (
    <div className="flex flex-col m-5 justify-center">
      {/* Photo Book Modal */}
      {isPhotoBookModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md">
            <h2 className="text-xl font-bold mb-4">Photo Book Options</h2>
            <div className="mb-4">
              <label
                htmlFor="pages"
                className="block text-gray-700 font-bold mb-2"
              >
                Number of Pages (1-20):
              </label>
              <input
                type="number"
                id="pages"
                name="pages"
                min="1"
                max="20"
                value={photoBookOptions.pages}
                onChange={handlePhotoBookChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="size"
                className="block text-gray-700 font-bold mb-2"
              >
                Page Size:
              </label>
              <select
                id="size"
                name="size"
                value={photoBookOptions.size}
                onChange={handlePhotoBookChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="8x11">8x11</option>
                <option value="11x14">11x14</option>
                <option value="12x12">12x12</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCreatePhotoBook}
                className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full shadow-sm transition-all duration-200"
              >
                Create Photo Book
              </button>
              <button
                onClick={() => setIsPhotoBookModalOpen(false)}
                className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-full shadow-sm transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
      />
    </div>
  );
};

export default App;
