/** Resize and re-encode JPGs so admin saves stay under Vercel's request body limit. */
export async function compressImageToDataUrl(
  file: File,
  maxWidth = 1200,
  quality = 0.72,
): Promise<string> {
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, maxWidth / bitmap.width);
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not process image.");
    ctx.drawImage(bitmap, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    bitmap.close();
  }
}

export function estimateDataUrlBytes(dataUrls: string[]): number {
  return dataUrls.reduce((sum, url) => sum + url.length, 0);
}

/** Vercel serverless request bodies are capped around 4.5 MB. */
export const MAX_PRODUCT_IMAGE_BYTES = 3_400_000;

/** Small GIF previews — kept separate from JPG gallery. */
export const MAX_PRODUCT_GIF_BYTES = 800_000;

export async function readGifToDataUrl(file: File, maxBytes = MAX_PRODUCT_GIF_BYTES): Promise<string> {
  if (!/^image\/gif$/i.test(file.type) && !/\.gif$/i.test(file.name)) {
    throw new Error("Only GIF files are allowed.");
  }
  if (file.size > maxBytes) {
    throw new Error(`GIF must be under ${Math.round(maxBytes / 1000)} KB.`);
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Could not read GIF."));
        return;
      }
      resolve(result);
    };
    reader.onerror = () => reject(new Error("Could not read GIF."));
    reader.readAsDataURL(file);
  });
}
