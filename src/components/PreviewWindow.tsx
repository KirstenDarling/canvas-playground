import React, { useRef, useEffect } from "react";
import * as fabric from "fabric";

interface PreviewProps {
  canvasInstanceRef: React.MutableRefObject<fabric.Canvas | null>;
}

const PreviewWindow: React.FC<PreviewProps> = ({ canvasInstanceRef }) => {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasInstanceRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    previewCanvasInstanceRef.current = new fabric.Canvas(
      previewCanvasRef.current!,
      {
        width: 200,
        height: 150,
        backgroundColor: "#fff",
        selection: false,
      }
    );

    const updatePreview = () => {
      if (canvasInstanceRef.current && previewCanvasInstanceRef.current) {
        const mainCanvas = canvasInstanceRef.current;
        const previewCanvas = previewCanvasInstanceRef.current;
        previewCanvas.clear();

        const zoom = Math.min(
          previewCanvas.width! / mainCanvas.width!,
          previewCanvas.height! / mainCanvas.height!
        );

        mainCanvas.getObjects().forEach((object) => {
          if (typeof object.clone === "function") {
            (object as any).clone((clonedObject: fabric.Object) => {
              // Create a new object of the same type as the original
              const newClonedObject = new (object.constructor as any)({
                left: clonedObject.left,
                top: clonedObject.top,
                width: clonedObject.width,
                height: clonedObject.height,
                // ... other properties you need ...
              });

              newClonedObject.scale(zoom);
              previewCanvas.add(newClonedObject);
            });
          } else {
            console.warn("Object is not cloneable:", object);
          }
        });

        previewCanvas.renderAll();
      }
    };

    canvasInstanceRef.current?.on("object:modified", updatePreview);
    canvasInstanceRef.current?.on("object:added", updatePreview);
    canvasInstanceRef.current?.on("object:removed", updatePreview);

    updatePreview();

    return () => {
      previewCanvasInstanceRef.current?.dispose();
    };
  }, [canvasInstanceRef]);

  return (
    <div className="absolute top-4 right-4 z-10 border border-gray-300">
      <canvas ref={previewCanvasRef} />
    </div>
  );
};

export default PreviewWindow;
