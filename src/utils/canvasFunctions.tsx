import * as fabric from "fabric";

interface PhotoBookOptions {
  pages: number;
  size: string;
}

interface PhotoPrintOptions {
  size: string;
}

interface PhotoTilesOptions {
  pages: number;
  size: string;
}

export const createPhotoBookPages = (
  canvasInstanceRef: React.MutableRefObject<fabric.Canvas | null>,
  photoBookOptions: PhotoBookOptions
) => {
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
        pageWidth = 400;
        pageHeight = 600;
        break;
    }

    const spineWidth = 50;
    const pagesPerSpread = 2;
    const numPages = photoBookOptions.pages;

    const spreadMarginTopBottom = 50;

    const screenWidth = window.innerWidth * 0.9;

    const canvasWidth = screenWidth;
    const canvasHeight =
      (numPages / pagesPerSpread) *
        (pageHeight + spreadMarginTopBottom * 2 + 50) +
      100;

    canvas.setWidth(canvasWidth);
    canvas.setHeight(canvasHeight);

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

    const pageAreaWidth = canvasWidth - spineWidth - 100;
    const pageAreaLeft =
      (pageAreaWidth - pageWidth * pagesPerSpread) / 2 + spineWidth + 50;

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
        left:
          i % 2 === 0
            ? pageAreaLeft + 20
            : pageAreaLeft + pageWidth * pagesPerSpread - 20,
        top: pageTop - 30,
        fontSize: 16,
        fontFamily: "Arial",
        textAlign: "center",
        originX: "center",
      });
      canvas.add(pageNumber);
    }

    canvas.renderAll();
  }
};

export const createPhotoPrintPages = (
  canvasInstanceRef: React.MutableRefObject<fabric.Canvas | null>,
  photoPrintOptions: PhotoPrintOptions
) => {
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
        pageWidth = 400;
        pageHeight = 600;
        break;
    }

    const spineWidth = 50;

    const pagesPerSpread = 2;
    const numPages = 1;

    const canvasWidth = 1300;
    const padding = (canvasWidth - pageWidth * pagesPerSpread - spineWidth) / 3;
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
};

export const createPhotoTilesPages = (
  canvasInstanceRef: React.MutableRefObject<fabric.Canvas | null>,
  photoTilesOptions: PhotoTilesOptions
) => {
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
        tileWidth = 800 / 2;
        tileHeight = 800 / 2;
        break;
    }

    const numTiles = photoTilesOptions.pages;
    const tilesPerRow = 3;
    // const numRows = Math.ceil(numTiles / tilesPerRow);

    const rowWidth = tilesPerRow * tileWidth;

    const initialOffset = (canvas.width! - rowWidth) / 2;

    for (let i = 0; i < numTiles; i++) {
      const row = Math.floor(i / tilesPerRow);
      const col = i % tilesPerRow;

      const rect = new fabric.Rect({
        left: initialOffset + col * tileWidth,
        top: 50 + row * tileHeight,
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
        top: rect.top! + tileHeight / 2,
        fontFamily: "Arial",
        textAlign: "center",
        originX: "center",
        originY: "center",
      });
      canvas.add(tileNumber);
    }

    canvas.renderAll();
  }
};
