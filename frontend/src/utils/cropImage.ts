export type Area = {
  width: number;
  height: number;
  x: number;
  y: number;
}

export const getCroppedImg = async (
  imageSrc: string,
  croppedAreaPixels: Area
): Promise<Blob> => {
  const image = new Image();
  image.src = imageSrc;
  image.crossOrigin = "anonymous";

  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  // Set canvas size to match the cropped area exactly
  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

  // Draw only the cropped portion from the original image
  ctx.drawImage(
    image,
    croppedAreaPixels.x,        // source x
    croppedAreaPixels.y,        // source y
    croppedAreaPixels.width,    // source width
    croppedAreaPixels.height,   // source height
    0,                          // destination x
    0,                          // destination y
    croppedAreaPixels.width,    // destination width
    croppedAreaPixels.height    // destination height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to create blob"));
        }
      },
      "image/jpeg",
      0.95
    );
  });
};