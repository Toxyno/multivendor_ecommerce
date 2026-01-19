// src/lib/utils.ts (client-safe)
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import ColorThief from "colorthief";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getGridClassName = (length: number) => {
  switch (length) {
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-2 grid-rows-2";
    case 4:
      return "grid-cols-2 grid-rows-1";
    case 5:
      return "grid-cols-2 grid-rows-6";
    case 6:
      return "grid-cols-2";
    default:
      return "";
  }
};

export const extractColorsFromImage = async (
  imageUrl: string
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 5);
        const hexColors = palette.map(
          (c) =>
            `#${((1 << 24) + (c[0] << 16) + (c[1] << 8) + c[2])
              .toString(16)
              .slice(1)
              .toUpperCase()}`
        );
        resolve(hexColors);
      } catch (e) {
        reject(e);
      }
    };

    img.onerror = () => reject(new Error("Failed to load image"));
  });
};
