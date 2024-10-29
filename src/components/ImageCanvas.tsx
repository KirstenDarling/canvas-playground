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
  const [isCropping, setIsCropping] = useState(false);
  const [cropRect, setCropRect] = useState<fabric.Rect | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  const createPhotoBookPages = useCallback(() => {
    if (canvasInstanceRef.current) {
      const canvas = canvasInstanceRef.current;
      canvas.clear();

      const { size } = photoBookOptions;

      let pageWidth;
      let pageHeight;

      switch (size) {
        case "4x6":
          pageWidth = 400;
          pageHeight = 600;
          break;
        case "8x11":
          pageWidth = 800 / 2;
          pageHeight = 1100 / 2;
          break;
        case "11x14":
          pageWidth = 1100 / 2;
          pageHeight = 1400 / 2;
          break;
        case "12x12":
          pageWidth = 1200 / 2;
          pageHeight = 1200 / 2;
          break;
        default:
          pageWidth = 400; // Default to 4x6
          pageHeight = 600;
          break;
      }

      const spineWidth = 50;
      const pagesPerSpread = 2;
      const numPages = photoBookOptions.pages;

      const spreadMarginTopBottom = 50; // Margin for top and bottom of each spread

      // Get 90% of screen width
      const screenWidth = window.innerWidth * 0.9;

      // Calculate canvas dimensions
      const canvasWidth = screenWidth;
      const canvasHeight =
        (numPages / pagesPerSpread) *
          (pageHeight + spreadMarginTopBottom * 2 + 50) +
        100;

      canvas.setWidth(canvasWidth);
      canvas.setHeight(canvasHeight);

      // Spine positioned on the left
      const spineLeft = 50;
      const spineTop = 50 + spreadMarginTopBottom;

      const spine = new fabric.Rect({
        left: spineLeft,
        top: spineTop,
        width: spineWidth,
        height: pageHeight,
        stroke: "black",
        strokeWidth: 2,
        fill: "white",
        selectable: false,
      });
      canvas.add(spine);

      const spineText = new fabric.IText("Spine", {
        left: spine.left! + spineWidth / 2,
        top: spine.top! + pageHeight + 10,
        fontSize: 16,
        fontFamily: "Arial",
        textAlign: "center",
        originX: "center",
      });
      canvas.add(spineText);

      // Calculate horizontal center position for pages
      const pageAreaWidth = canvasWidth - spineWidth - 100;
      const pageAreaLeft =
        (pageAreaWidth - pageWidth * pagesPerSpread) / 2 + spineWidth + 50;

      // Render pages
      for (let i = 0; i < numPages; i++) {
        const pageLeft = pageAreaLeft + (i % pagesPerSpread) * pageWidth;
        const pageTop =
          Math.floor(i / pagesPerSpread) *
            (pageHeight + spreadMarginTopBottom * 2 + 50) +
          50 +
          spreadMarginTopBottom;

        const rect = new fabric.Rect({
          left: pageLeft,
          top: pageTop,
          width: pageWidth,
          height: pageHeight,
          stroke: "black",
          strokeWidth: 2,
          fill: "white",
          selectable: false,
        });
        canvas.add(rect);

        const pageNumber = new fabric.IText((i + 1).toString(), {
          left: rect.left! + pageWidth / 2,
          top: rect.top! + pageHeight + 10,
          fontSize: 16,
          fontFamily: "Arial",
          textAlign: "center",
          originX: "center",
        });
        canvas.add(pageNumber);
      }

      canvas.renderAll();
    }
  }, [photoBookOptions, canvasInstanceRef]);

  const createPhotoPrintPages = useCallback(() => {
    if (canvasInstanceRef.current) {
      const canvas = canvasInstanceRef.current;
      canvas.clear();

      const { size } = photoPrintOptions;

      let pageWidth;
      let pageHeight;

      switch (size) {
        case "4x6":
          pageWidth = 400;
          pageHeight = 600;
          break;
        case "8x11":
          pageWidth = 800 / 2;
          pageHeight = 1100 / 2;
          break;
        case "11x14":
          pageWidth = 1100 / 2;
          pageHeight = 1400 / 2;
          break;
        case "12x12":
          pageWidth = 1200 / 2;
          pageHeight = 1200 / 2;
          break;
        default:
          // Handle any unexpected sizes here, perhaps with default values or an error
          pageWidth = 400; // Default to 4x6
          pageHeight = 600;
          break;
      }

      const spineWidth = 50;

      const pagesPerSpread = 2;
      // const numPages = photoPrintOptions.pages;
      const numPages = 1;

      const canvasWidth = 1300;
      const padding =
        (canvasWidth - pageWidth * pagesPerSpread - spineWidth) / 3;
      const spreadWidth = pageWidth * pagesPerSpread + padding + spineWidth;
      const numSpreads = Math.ceil(numPages / pagesPerSpread);

      for (let i = 0; i < numSpreads; i++) {
        const initialOffset = i * spreadWidth + padding + spineWidth + padding;

        for (let j = 0; j < pagesPerSpread; j++) {
          const pageIndex = i * pagesPerSpread + j;
          if (pageIndex < numPages) {
            const rect = new fabric.Rect({
              left: initialOffset + j * pageWidth,
              top: 50,
              width: pageWidth,
              height: pageHeight,
              stroke: "black",
              strokeWidth: 2,
              fill: "white",
              selectable: false,
            });
            canvas.add(rect);

            const pageNumber = new fabric.IText((pageIndex + 1).toString(), {
              left: rect.left! + pageWidth / 2,
              top: rect.top! + pageHeight + 10,
              fontSize: 16,
              fontFamily: "Arial",
              textAlign: "center",
              originX: "center",
            });
            canvas.add(pageNumber);
          }
        }
      }
      canvas.renderAll();
    }
  }, [photoPrintOptions, canvasInstanceRef]);

  const createPhotoTilesPages = useCallback(() => {
    if (canvasInstanceRef.current) {
      const canvas = canvasInstanceRef.current;
      canvas.clear();

      const { size } = photoTilesOptions;

      let tileWidth;
      let tileHeight;

      switch (size) {
        case "8x8":
          tileWidth = 800 / 2;
          tileHeight = 800 / 2;
          break;
        case "10x10":
          tileWidth = 1000 / 2;
          tileHeight = 1000 / 2;
          break;
        default:
          tileWidth = 800 / 2; // Default to 8x8
          tileHeight = 800 / 2;
          break;
      }

      const numTiles = photoTilesOptions.pages;
      const tilesPerRow = 3;
      const numRows = Math.ceil(numTiles / tilesPerRow);

      // Calculate the total width of the tiles in a row
      const rowWidth = tilesPerRow * tileWidth;

      // Calculate the starting left position to center the tiles
      const initialOffset = (canvas.width! - rowWidth) / 2;

      for (let i = 0; i < numTiles; i++) {
        const row = Math.floor(i / tilesPerRow); // Calculate the row index
        const col = i % tilesPerRow; // Calculate the column index

        const rect = new fabric.Rect({
          left: initialOffset + col * tileWidth,
          top: 50 + row * tileHeight, // Position tiles in rows
          width: tileWidth,
          height: tileHeight,
          stroke: "black",
          strokeWidth: 2,
          fill: "white",
          selectable: false,
        });
        canvas.add(rect);

        const tileNumber = new fabric.IText((i + 1).toString(), {
          left: rect.left! + tileWidth / 2,
          top: rect.top! + tileHeight / 2, // Center the number within the tile
          fontSize: 20,
          fontFamily: "Arial",
          textAlign: "center",
          originX: "center",
          originY: "center", // Center vertically
        });
        canvas.add(tileNumber);
      }

      canvas.renderAll();
    }
  }, [photoTilesOptions, canvasInstanceRef]);

  useEffect(() => {
    if (canvasInstanceRef.current) {
      const canvas = canvasInstanceRef.current;
      const pageWidth = photoBookOptions.size === "4x6" ? 600 : 400;
      const xOffset = (currentPage - 1) * 2 * (pageWidth + 50);

      const newPan = new fabric.Point(xOffset, 0);
      canvas.absolutePan(newPan);
    }
  }, [currentPage, photoBookOptions]);

  useEffect(() => {
    if (shouldCreatePrint) {
      createPhotoPrintPages();
    }
    if (shouldCreatePhotoBook) {
      createPhotoBookPages();
    }
    if (shouldCreateTiles) {
      createPhotoTilesPages();
    }
  }, [
    shouldCreatePrint,
    shouldCreatePhotoBook,
    shouldCreateTiles,
    createPhotoBookPages,
    createPhotoPrintPages,
    createPhotoTilesPages,
  ]);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!, {
      width: 1300,
      height: 1000,
      backgroundColor: "#fff",
      selection: true,
    });
    canvasInstanceRef.current = canvas;

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      const { offsetX, offsetY } = e;
      const imageUrl = e.dataTransfer!.getData("imageUrl");

      fabric.Image.fromURL(imageUrl, {}).then((img) => {
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

        img.set({
          scaleX: 0.5,
          scaleY: 0.5,
        });

        if (page) {
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
        fill: "rgba(0,0,0,0.3)",
        strokeDashArray: [5, 5],
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
    updateCanvasWidth();
    window.addEventListener("resize", updateCanvasWidth);
    return () => window.removeEventListener("resize", updateCanvasWidth);
  }, []);

  const [isAddingText, setIsAddingText] = useState(false);

  const addTextToSpine = useCallback(() => {
    if (canvasInstanceRef.current) {
      const canvas = canvasInstanceRef.current;

      const spine = canvas.getObjects().find((obj) => {
        return obj instanceof fabric.Rect && obj.width === 50;
      }) as fabric.Rect | undefined;

      if (spine) {
        setIsAddingText(true);

        const text = new fabric.IText("Spine Text", {
          left: spine.left! + spine.width! / 2,
          top: spine.top! + 20,
          fontSize: 20,
          fontFamily: "Arial",
          fill: "black",
          angle: 90,
          originX: "center",
          hasRotatingPoint: false,
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
      }
    }
  }, []);

  useEffect(() => {
    if (isAddingText) {
      const canvas = canvasInstanceRef.current!;

      const handleTextEntry = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          canvas.discardActiveObject();
          setIsAddingText(false);
        }
      };

      window.addEventListener("keydown", handleTextEntry);
      return () => window.removeEventListener("keydown", handleTextEntry);
    }
  }, [isAddingText]);

  const [hasImage, setHasImage] = useState(false);

  useEffect(() => {
    const canvas = canvasInstanceRef.current;

    const updateHasImage = () => {
      setHasImage(
        canvas!.getObjects().some((obj) => obj instanceof fabric.Image)
      );
    };

    if (canvas) {
      canvas.on("object:added", updateHasImage);
      canvas.on("object:removed", updateHasImage);

      return () => {
        canvas.off("object:added", updateHasImage);
        canvas.off("object:removed", updateHasImage);
      };
    }
  }, []);

  const [hasPhotoBook, setHasPhotoBook] = useState(false);

  useEffect(() => {
    const updateHasPhotoBook = () => {
      const canvas = canvasInstanceRef.current;
      setHasPhotoBook(
        canvas!.getObjects().some((obj) => obj instanceof fabric.Rect)
      );
    };

    if (canvasInstanceRef.current) {
      canvasInstanceRef.current.on("object:added", updateHasPhotoBook);
      canvasInstanceRef.current.on("object:removed", updateHasPhotoBook);

      return () => {
        canvasInstanceRef.current!.off("object:added", updateHasPhotoBook);
        canvasInstanceRef.current!.off("object:removed", updateHasPhotoBook);
      };
    }
  }, []);

  return (
    <div className="relative h-[700px]">
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
        {/* Make Photo Print Button with Tooltip */}
        <button
          onClick={() => setIsPhotoPrintModalOpen(!isPhotoPrintModalOpen)}
          className="relative p-2 group"
        >
          <FaImage size={20} />
          <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-8 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
            Make Single Photo Print
          </span>
        </button>
        {/* Make Photo Book Button with Tooltip */}
        <button
          onClick={() => setIsPhotoBookModalOpen(!isPhotoBookModalOpen)}
          className="relative p-2 group"
        >
          <BsBookHalf size={20} />
          <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-8 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
            Make Photo Book
          </span>
        </button>
        {/* Make Photo Tiles Button with Tooltip */}
        <button
          onClick={() => setIsPhotoTilesModalOpen(!isPhotoTilesModalOpen)}
          className="relative p-2 group"
        >
          <BsGrid3X3GapFill size={20} />
          <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-8 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
            Make Photo Tiles
          </span>
        </button>
        {/* Crop Button with Tooltip */}
        <button
          onClick={startCropping}
          disabled={!selectedImage || isCropping || !hasImage}
          className={`relative p-2 group 
            ${
              !selectedImage || isCropping || !hasImage
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
        >
          <BsCrop size={20} />
          <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-8 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
            Crop Image
          </span>
        </button>
        {/* Finalize Crop Button with Tooltip */}
        <button
          onClick={cropImage}
          disabled={!cropRect || !hasImage}
          className={`relative p-2 group 
            ${!cropRect || !hasImage ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <BsArrowsFullscreen size={20} />
          <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-8 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
            Finalize Crop
          </span>
        </button>
        {/* Flip Horizontal Button with Tooltip */}
        <button
          onClick={flipImageHorizontal}
          disabled={!selectedImage || !hasImage}
          className={`relative p-2 group 
            ${
              !selectedImage || !hasImage ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          <BsImage size={20} className="transform rotate-y-180" />
          <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-8 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
            Flip Horizontal
          </span>
        </button>
        {/* Flip Vertical Button with Tooltip */}
        <button
          onClick={flipImageVertical}
          disabled={!selectedImage || !hasImage}
          className={`relative p-2 group
            ${
              !selectedImage || !hasImage ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          <BsImage size={20} className="transform rotate-x-180" />
          <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-8 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
            Flip Vertical
          </span>
        </button>
        {/* Add Text Button with Tooltip */}
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
