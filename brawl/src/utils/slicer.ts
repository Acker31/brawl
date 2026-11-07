import JSZip from 'jszip';
import { CharacterIconData, SlicingCoord } from '../types';

let cachedImage: HTMLImageElement | null = null;
let cachedImageSrc = '';

export function loadImage(src: string): Promise<HTMLImageElement> {
  if (cachedImage && cachedImageSrc === src && cachedImage.complete) {
    return Promise.resolve(cachedImage);
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      cachedImage = img;
      cachedImageSrc = src;
      resolve(img);
    };
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

export interface SliceOptions {
  size?: number; // target width/height in px, default 512
  isCircular?: boolean; // clip circle or keep square
  isBustPortrait?: boolean; // zoom closely into head and shoulders bust
  includeBorder?: boolean; // draw extra glossy outer ring
  borderColor?: string;
  badgeOverlay?: boolean;
}

export async function sliceCharacterIcon(
  imageSrc: string,
  crop: SlicingCoord,
  options: SliceOptions = {}
): Promise<string> {
  const {
    size = 512,
    isCircular = true,
    isBustPortrait = false,
    includeBorder = false,
    borderColor = '#fbbf24',
  } = options;

  const img = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Calculate pixel bounds on original image
  const imgW = img.naturalWidth || img.width;
  const imgH = img.naturalHeight || img.height;

  // If bust portrait: zoom in and center upward on face/helmet
  const effectiveRadiusPercent = isBustPortrait ? crop.radius * 0.68 : crop.radius;
  const effectiveCenterYPercent = isBustPortrait ? crop.cy - (crop.radius * 0.18) : crop.cy;
  const effectiveCenterXPercent = crop.cx;

  const centerX = (effectiveCenterXPercent / 100) * imgW;
  const centerY = (effectiveCenterYPercent / 100) * imgH;
  // Radius based on width percentage
  const radiusPx = (effectiveRadiusPercent / 100) * imgW;

  const sourceX = centerX - radiusPx;
  const sourceY = centerY - radiusPx;
  const sourceDiameter = radiusPx * 2;

  if (isCircular) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
  }

  // Draw the cropped region
  ctx.drawImage(
    img,
    sourceX,
    sourceY,
    sourceDiameter,
    sourceDiameter,
    0,
    0,
    size,
    size
  );

  if (isCircular) {
    ctx.restore();

    if (includeBorder) {
      // Draw outer stylized arcade ring
      ctx.save();
      ctx.lineWidth = 12;
      ctx.strokeStyle = borderColor;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 8, 0, Math.PI * 2);
      ctx.stroke();

      // Inner shadow / rim highlight
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  return canvas.toDataURL('image/png');
}

export async function exportAllIconsZip(
  imageSrc: string,
  characters: CharacterIconData[],
  options: SliceOptions = {},
  onProgress?: (progress: number, label: string) => void
): Promise<Blob> {
  const zip = new JSZip();
  const folder = zip.folder('brawl_arcade_icons');

  const manifestData: Record<string, unknown>[] = [];

  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    if (onProgress) {
      onProgress(Math.round(((i + 1) / characters.length) * 80), `Cropping ${char.id} - ${char.name}...`);
    }

    const dataUrl = await sliceCharacterIcon(imageSrc, char.crop, options);
    const base64Data = dataUrl.split(',')[1];
    const safeName = char.name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${char.id}_${safeName}.png`;

    folder?.file(filename, base64Data, { base64: true });

    manifestData.push({
      id: char.id,
      index: char.index,
      name: char.name,
      filename,
      role: char.role,
      classType: char.classType,
      rarity: char.rarity,
      theme: char.theme,
      crop: char.crop,
      stats: char.stats,
      superMove: char.superMove,
      voiceLine: char.voiceLine,
    });
  }

  if (onProgress) {
    onProgress(90, 'Generating manifest & packing zip...');
  }

  folder?.file('manifest.json', JSON.stringify({
    title: 'Brawl Grid 13-Character Arcade Profile Icons',
    license: 'Creative Game Asset Suite',
    iconsCount: characters.length,
    styleTokens: {
      outlineStroke: '4px thick stylized outer border',
      proportions: 'Rounded, chunky arcade proportions',
      shading: 'Glossy tactile button gradient and rim lighting',
      palette: 'High-contrast primary and neon palette',
    },
    icons: manifestData,
  }, null, 2));

  const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
    if (onProgress) {
      onProgress(90 + Math.round(metadata.percent * 0.1), 'Compressing archive...');
    }
  });

  return content;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
