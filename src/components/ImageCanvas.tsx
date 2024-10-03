// imageCanvas.tsx
import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";

interface Image {
  url: string;
}

interface CanvasObject extends fabric.Object {
  original?: fabric.Image;
}

const ImageCanvas: React.FC<{ images: Image[] }> = ({ images }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedImage, setSelectedImage] = useState<CanvasObject | null>(null);
  const [cropping, setCropping] = useState(false);
  const [cropRect, setCropRect] = useState<fabric.Rect | null>(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!, {
      width: 1200,
      height: 800,
      backgroundColor: "#fff",
      selection: true,
    });
    setCanvas(canvas);

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      const { offsetX, offsetY } = e;
      const imageUrl = e.dataTransfer.getData("imageUrl");
      fabric.Image.fromURL(imageUrl, {}, (img) => {
        img.set({
          left: offsetX,
          top: offsetY,
          scaleX: 0.5,
          scaleY: 0.5,
          selectable: true,
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      });
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    canvas.on("selection:created", (e) => {
      setSelectedImage(e.selected[0] as CanvasObject);
    });

    canvas.on("selection:cleared", () => {
      setSelectedImage(null);
      setCropping(false);
      if (cropRect) {
        canvas.remove(cropRect);
        setCropRect(null);
      }
    });

    const canvasContainer = canvasRef.current!.parentElement;
    canvasContainer?.addEventListener("drop", handleDrop);
    canvasContainer?.addEventListener("dragover", handleDragOver);

    return () => {
      canvasContainer?.removeEventListener("drop", handleDrop);
      canvasContainer?.removeEventListener("dragover", handleDragOver);
      canvas.dispose();
    };
  }, [images]);

  const deleteSelectedImage = () => {
    if (selectedImage) {
      canvas!.remove(selectedImage);
      canvas!.requestRenderAll();
      setSelectedImage(null);
    }
  };

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

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage]);

  const startCropping = () => {
    if (!selectedImage) return;
    setCropping(true);

    const rect = new fabric.Rect({
      left: selectedImage.left,
      top: selectedImage.top,
      width: selectedImage.width! * selectedImage.scaleX!,
      height: selectedImage.height! * selectedImage.scaleY!,
      fill: "rgba(0,0,0,0.3)",
      stroke: "black",
      strokeWidth: 1,
      hasRotatingPoint: false,
      cornerSize: 10,
      transparentCorners: false,
      objectCaching: false,
    });
    canvas!.add(rect);
    canvas!.setActiveObject(rect);
    setCropRect(rect);
  };

  const cropImage = () => {
    if (!selectedImage || !cropRect) return;

    const croppedImage = new Image();
    croppedImage.src = selectedImage.original!.toDataURL();

    croppedImage.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = cropRect.width!;
      canvas.height = cropRect.height!;
      ctx.drawImage(
        croppedImage,
        -cropRect.left!,
        -cropRect.top!,
        selectedImage.width! * selectedImage.scaleX!,
        selectedImage.height! * selectedImage.scaleY!
      );

      const newImage = new fabric.Image(canvas, {
        left: cropRect.left,
        top: cropRect.top,
        scaleX: 1,
        scaleY: 1,
        selectable: true,
      });

      canvas!.remove(selectedImage);
      canvas!.remove(cropRect);
      canvas!.add(newImage);
      canvas!.setActiveObject(newImage);
    };

    setCropping(false);
    setCropRect(null);
  };

  const flipImage = (horizontal: boolean) => {
    if (!selectedImage) return;
    selectedImage.set({
      flipX: horizontal ? !selectedImage.flipX : selectedImage.flipX,
    });
    canvas!.renderAll();
  };

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="border border-gray-500" />
      <div className="absolute top-4 right-4">
        {selectedImage && (
          <div>
            {!cropping && (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={startCropping}
              >
                Crop
              </button>
            )}
            {cropping && (
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={cropImage}
              >
                Done Cropping
              </button>
            )}
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
              onClick={deleteSelectedImage}
            >
              Delete
            </button>
            <button
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
              onClick={() => flipImage(true)}
            >
              Flip Horizontal
            </button>
            <button
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => flipImage(false)}
            >
              Flip Vertical
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCanvas;
