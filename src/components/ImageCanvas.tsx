import React, { useCallback, useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { BsCrop, BsArrowsFullscreen, BsImage } from "react-icons/bs";

interface ImageCanvasProps {
  images: string[];
  isGalleryVisible: boolean;
  setIsGalleryVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageCanvas: React.FC<ImageCanvasProps> = ({
  images,
  isGalleryVisible,
  setIsGalleryVisible,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedImage, setSelectedImage] = useState<fabric.Object | null>(
    null
  );
  const canvasInstanceRef = useRef<fabric.Canvas | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [cropRect, setCropRect] = useState<fabric.Rect | null>(null);

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
        img.set({
          left: offsetX,
          top: offsetY,
          scaleX: 0.5,
          scaleY: 0.5,
          selectable: true,
        });
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
  }, [images]);

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
      </div>
      <canvas ref={canvasRef} className="border border-gray-500 w-full" />
    </div>
  );
};

export default ImageCanvas;
