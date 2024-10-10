import React, { useCallback, useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import {
  BsCrop,
  BsArrowsFullscreen,
  BsImage,
  BsBookHalf,
} from "react-icons/bs";

interface ImageCanvasProps {
  images: string[];
  isGalleryVisible: boolean;
  setIsGalleryVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPhotoBookModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isPhotoBookModalOpen: boolean;
  photoBookOptions: { pages: number; size: string };
  onCreatePhotoBook: () => void;
}

const ImageCanvas: React.FC<ImageCanvasProps> = ({
  images,
  isGalleryVisible,
  setIsGalleryVisible,
  isPhotoBookModalOpen,
  setIsPhotoBookModalOpen,
  photoBookOptions,
  onCreatePhotoBook,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedImage, setSelectedImage] = useState<fabric.Object | null>(
    null
  );
  const canvasInstanceRef = useRef<fabric.Canvas | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [cropRect, setCropRect] = useState<fabric.Rect | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  const createPhotoBookPages = useCallback(() => {
    if (canvasInstanceRef.current) {
      const canvas = canvasInstanceRef.current;
      canvas.clear(); // Clear existing content

      const pageWidth = photoBookOptions.size === "4x6" ? 600 : 400;
      const pageHeight = photoBookOptions.size === "4x6" ? 400 : 600;

      // Calculate total pages and pages per spread
      const totalPages = photoBookOptions.pages;
      const pagesPerSpread = 2;
      const numSpreads = Math.ceil(totalPages / pagesPerSpread);

      // Calculate canvas width based on total pages and page size
      const canvasWidth = numSpreads * (pageWidth * pagesPerSpread + 50); // Adjust spacing as needed
      canvas.setWidth(canvasWidth);

      for (let i = 0; i < numSpreads; i++) {
        for (let j = 0; j < pagesPerSpread; j++) {
          const pageIndex = i * pagesPerSpread + j;
          if (pageIndex < totalPages) {
            const rect = new fabric.Rect({
              left: i * (pageWidth * pagesPerSpread + 50) + j * pageWidth, // Position pages in spreads
              top: 50, // Adjust spacing as needed
              width: pageWidth,
              height: pageHeight,
              stroke: "black",
              strokeWidth: 2,
              fill: "white",
            });
            canvas.add(rect);
          }
        }
      }
      canvas.renderAll();
    }
  }, [photoBookOptions]);

  // Function to handle page navigation
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(photoBookOptions.pages / 2)) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    // Update canvas viewport when currentPage changes
    if (canvasInstanceRef.current) {
      const canvas = canvasInstanceRef.current;
      const pageWidth = photoBookOptions.size === "4x6" ? 600 : 400;
      const xOffset = (currentPage - 1) * 2 * (pageWidth + 50); // Adjust spacing as needed

      // Use fabric.Point instead of a plain object
      const newPan = new fabric.Point(xOffset, 0);
      canvas.absolutePan(newPan);
    }
  }, [currentPage, photoBookOptions]);

  useEffect(() => {
    if (!isPhotoBookModalOpen) {
      // Modal has been closed
      createPhotoBookPages();
    }
  }, [isPhotoBookModalOpen, createPhotoBookPages]);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!, {
      width: 1200,
      height: 800,
      backgroundColor: "#fff",
      selection: true,
    });
    canvasInstanceRef.current = canvas;

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      const { offsetX, offsetY } = e;
      const imageUrl = e.dataTransfer!.getData("imageUrl");

      fabric.Image.fromURL(imageUrl, {}).then((img) => {
        // Find the page where the image was dropped (if any)
        const page = canvas.getObjects().find((obj) => {
          if (obj instanceof fabric.Rect) {
            const { left, top, width, height } = obj;
            return (
              offsetX >= left &&
              offsetX <= left + width &&
              offsetY >= top &&
              offsetY <= top + height
            );
          }
          return false;
        }) as fabric.Rect | undefined;

        if (page) {
          // Calculate scale to fit the image inside the page
          const scale = Math.min(
            page.width! / img.width!,
            page.height! / img.height!
          );

          img.set({
            left: page.left! + (page.width! - img.width! * scale) / 2,
            top: page.top! + (page.height! - img.height! * scale) / 2,
            scaleX: scale,
            scaleY: scale,
            selectable: true,
          });
        } else {
          // Normal drop behavior if not dropped on a page
          img.set({
            left: offsetX,
            top: offsetY,
            scaleX: 0.5,
            scaleY: 0.5,
            selectable: true,
          });
        }

        canvas.add(img);
        canvas.renderAll();
      });
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    canvas.on("selection:created", (options: { selected: fabric.Object[] }) => {
      setSelectedImage(options.selected[0]);
    });

    canvas.on("selection:cleared", () => {
      setSelectedImage(null);
      setIsCropping(false);
      setCropRect(null);
    });

    const canvasContainer = canvasRef.current!.parentElement;
    canvasContainer!.addEventListener("drop", handleDrop);
    canvasContainer!.addEventListener("dragover", handleDragOver);

    return () => {
      canvasContainer!.removeEventListener("drop", handleDrop);
      canvasContainer!.removeEventListener("dragover", handleDragOver);
      canvas.dispose();
    };
  }, []);

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

  const startCropping = useCallback(() => {
    if (selectedImage instanceof fabric.Image && !isCropping) {
      setIsCropping(true);

      const croppedObject = new fabric.Rect({
        left: selectedImage.left,
        top: selectedImage.top,
        width: selectedImage.width * selectedImage.scaleX,
        height: selectedImage.height * selectedImage.scaleY,
        fill: "rgba(0,0,0,0.3)", // You can adjust the fill color
        strokeDashArray: [5, 5], // Add a dashed border
        stroke: "blue",
        strokeWidth: 2,
        hasRotatingPoint: false,
        cornerSize: 10,
        transparentCorners: false,
      });
      setCropRect(croppedObject);
      canvasInstanceRef.current!.add(croppedObject);
      canvasInstanceRef.current!.setActiveObject(croppedObject);
    }
  }, [selectedImage, isCropping]);

  const cropImage = useCallback(() => {
    if (
      selectedImage instanceof fabric.Image &&
      cropRect &&
      canvasInstanceRef.current
    ) {
      const { top, left, width, height } = cropRect.getBoundingRect();
      const croppedImageDataURL = canvasInstanceRef.current.toDataURL({
        left: left,
        top: top,
        width: width,
        height: height,
        multiplier: 1,
      });
      fabric.Image.fromURL(croppedImageDataURL).then((croppedImg) => {
        canvasInstanceRef.current!.remove(selectedImage);
        canvasInstanceRef.current!.remove(cropRect);
        setCropRect(null);
        setIsCropping(false);
        canvasInstanceRef.current!.add(croppedImg);
        canvasInstanceRef.current!.renderAll();
      });
    }
  }, [selectedImage, cropRect]);

  const flipImageHorizontal = useCallback(() => {
    if (selectedImage instanceof fabric.Image) {
      selectedImage.set("flipX", !selectedImage.flipX);
      canvasInstanceRef.current!.requestRenderAll();
    }
  }, [selectedImage]);

  const flipImageVertical = useCallback(() => {
    if (selectedImage instanceof fabric.Image) {
      selectedImage.set("flipY", !selectedImage.flipY);
      canvasInstanceRef.current!.requestRenderAll();
    }
  }, [selectedImage]);

  useEffect(() => {
    const updateCanvasWidth = () => {
      if (canvasRef.current) {
        canvasInstanceRef.current!.setWidth(canvasRef.current.offsetWidth);
      }
    };
    updateCanvasWidth(); // Set initial width
    window.addEventListener("resize", updateCanvasWidth); // Update on resize
    return () => window.removeEventListener("resize", updateCanvasWidth);
  }, []);

  return (
    <div className="relative">
      <div className="flex gap-2 mb-4">
        {/* Toggle Gallery Button */}
        <button
          onClick={() => setIsGalleryVisible(!isGalleryVisible)}
          className="bg-purple-400 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-full shadow-sm transition-all duration-200"
        >
          {isGalleryVisible ? "Hide Image Gallery" : "Show Image Gallery"}
          <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-8 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
            {isGalleryVisible ? "Hide Gallery" : "Show Gallery"}
          </span>
        </button>
        {/* Crop Button with Tooltip */}
        <button
          onClick={startCropping}
          disabled={!selectedImage || isCropping}
          className="relative p-2 group"
        >
          <BsCrop size={20} />
          <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-8 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
            Crop Image
          </span>
        </button>
        {/* Finalize Crop Button with Tooltip */}
        <button
          onClick={cropImage}
          disabled={!cropRect}
          className="relative p-2 group"
        >
          <BsArrowsFullscreen size={20} />
          <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-8 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
            Finalize Crop
          </span>
        </button>
        {/* Flip Horizontal Button with Tooltip */}
        <button
          onClick={flipImageHorizontal}
          disabled={!selectedImage}
          className="relative p-2 group"
        >
          <BsImage size={20} className="transform rotate-y-180" />
          <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-8 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
            Flip Horizontal
          </span>
        </button>
        {/* Flip Vertical Button with Tooltip */}
        <button
          onClick={flipImageVertical}
          disabled={!selectedImage}
          className="relative p-2 group"
        >
          <BsImage size={20} className="transform rotate-x-180" />
          <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-8 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
            Flip Vertical
          </span>
        </button>
        {/* Make Photo Book Button with Tooltip */}
        <button
          onClick={() => setIsPhotoBookModalOpen(!isPhotoBookModalOpen)} // Assuming you pass this function as a prop
          className="relative p-2 group"
        >
          <BsBookHalf size={20} />
          <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-8 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
            Make Photo Book
          </span>
        </button>
      </div>
      <canvas ref={canvasRef} className="border border-gray-500 w-full" />
      {/* Pagination Controls */}

      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300  
 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
        >
          Prev
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(photoBookOptions.pages / 2)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ImageCanvas;
