import { useCallback, useEffect, useState } from "react";
import * as fabric from "fabric";

export const useCropping = (
  selectedImage: fabric.Object,
  canvasInstanceRef: React.MutableRefObject<fabric.Canvas | null>
) => {
  const [isCropping, setIsCropping] = useState(false);
  const [cropRect, setCropRect] = useState<fabric.Rect | null>(null);

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
  }, [selectedImage, isCropping, canvasInstanceRef]);

  const cropImage = useCallback(() => {
    if (
      selectedImage instanceof fabric.Image &&
      cropRect &&
      canvasInstanceRef.current
    ) {
      const { top, left, width, height } = cropRect.getBoundingRect();
      // eslint-disable-next-line semi
      const croppedImageDataURL = canvasInstanceRef.current.toDataURL({
        left,
        top: top,
        width: width,
        height: height,
        // eslint-disable-next-line semi
        multiplier: 1,
        // eslint-disable-next-line semi
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
  }, [selectedImage, cropRect, canvasInstanceRef]);

  return {
    isCropping,
    setIsCropping,
    cropRect,
    setCropRect,
    startCropping,
    cropImage,
  };
};

export const useImageHandling = (
  canvasInstanceRef: React.MutableRefObject<fabric.Canvas | null>,
  setIsCropping: React.Dispatch<React.SetStateAction<boolean>>,
  setCropRect: React.Dispatch<React.SetStateAction<fabric.Rect | null>>
) => {
  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      const { offsetX, offsetY } = e;
      const imageUrl = e.dataTransfer!.getData("imageUrl");

      fabric.Image.fromURL(imageUrl, {}).then((img) => {
        const page = canvasInstanceRef.current!.getObjects().find((obj) => {
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

        canvasInstanceRef.current!.add(img);
        canvasInstanceRef.current!.renderAll();
      });
    },
    [canvasInstanceRef]
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  return { handleDrop, handleDragOver };
};

export const useTextAdding = (
  canvasInstanceRef: React.MutableRefObject<fabric.Canvas | null>
) => {
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
  }, [canvasInstanceRef]);

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
  }, [isAddingText, canvasInstanceRef]);

  return { isAddingText, setIsAddingText, addTextToSpine };
};

export const useCanvas = (
  canvasInstanceRef: React.MutableRefObject<fabric.Canvas | null>
) => {
  const [hasImage, setHasImage] = useState(false);
  const [hasPhotoBook, setHasPhotoBook] = useState(false);

  useEffect(() => {
    const canvas = canvasInstanceRef.current;

    const updateHasImage = () => {
      setHasImage(
        canvas!.getObjects().some((obj) => obj instanceof fabric.Image)
      );
    };

    const updateHasPhotoBook = () => {
      setHasPhotoBook(
        canvas!.getObjects().some((obj) => obj instanceof fabric.Rect)
      );
    };

    if (canvas) {
      canvas.on("object:added", updateHasImage);
      canvas.on("object:removed", updateHasImage);
      canvas.on("object:added", updateHasPhotoBook);
      canvas.on("object:removed", updateHasPhotoBook);

      return () => {
        canvas.off("object:added", updateHasImage);
        canvas.off("object:removed", updateHasImage);
        canvas.off("object:added", updateHasPhotoBook);
        canvas.off("object:removed", updateHasPhotoBook);
      };
    }
  }, [canvasInstanceRef]);

  return { hasImage, hasPhotoBook };
};
