import { ImageSource } from "expo-image";

export function getCachedImageSource(imageUrl: string): ImageSource | null {
  if (!imageUrl) return null;

  const imageUrlInstance = new URL(imageUrl);
  const imageCacheKey = imageUrlInstance.origin + imageUrlInstance.pathname;

  return { uri: imageUrl, cacheKey: imageCacheKey };
}