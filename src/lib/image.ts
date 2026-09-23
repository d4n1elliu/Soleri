const TARGETS = {
  avatar: { width: 512, height: 512 },
  banner: { width: 1500, height: 500 },
} as const;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read that image'));
    };
    img.src = url;
  });
}

// Centre-crop, resize, re-encode (WebP, JPEG fallback); re-encoding drops EXIF
export async function processProfileImage(
  file: File,
  kind: 'avatar' | 'banner',
): Promise<Blob> {
  const { width, height } = TARGETS[kind];
  const img = await loadImage(file);

  const sourceAspect = img.naturalWidth / img.naturalHeight;
  const targetAspect = width / height;
  let cropWidth = img.naturalWidth;
  let cropHeight = img.naturalHeight;
  if (sourceAspect > targetAspect) cropWidth = Math.round(img.naturalHeight * targetAspect);
  else cropHeight = Math.round(img.naturalWidth / targetAspect);
  const cropX = Math.round((img.naturalWidth - cropWidth) / 2);
  const cropY = Math.round((img.naturalHeight - cropHeight) / 2);

  const canvas = document.createElement('canvas');
  canvas.width = Math.min(width, cropWidth);
  canvas.height = Math.round(canvas.width / targetAspect);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not process that image');
  ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);

  const toBlob = (type: string, quality: number) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

  let blob = await toBlob('image/webp', 0.85);
  if (!blob || blob.type !== 'image/webp') blob = await toBlob('image/jpeg', 0.85);
  if (!blob) throw new Error('Could not process that image');
  return blob;
}
