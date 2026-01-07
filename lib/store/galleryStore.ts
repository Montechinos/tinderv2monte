let photos: string[] = [];
let listeners: Array<() => void> = [];

export const galleryStore = {
  getPhotos: () => photos,
  
  addPhoto: (uri: string) => {
    photos = [...photos, uri];
    listeners.forEach(listener => listener());
  },
  
  removePhoto: (index: number) => {
    photos = photos.filter((_, i) => i !== index);
    listeners.forEach(listener => listener());
  },
  
  clearGallery: () => {
    photos = [];
    listeners.forEach(listener => listener());
  },
  
  subscribe: (listener: () => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }
};

// Hook personalizado
import { useState, useEffect } from 'react';

export function useGalleryStore() {
  const [photos, setPhotos] = useState(galleryStore.getPhotos());

  useEffect(() => {
    const unsubscribe = galleryStore.subscribe(() => {
      setPhotos(galleryStore.getPhotos());
    });
    return unsubscribe;
  }, []);

  return {
    photos,
    addPhoto: galleryStore.addPhoto,
    removePhoto: galleryStore.removePhoto,
    clearGallery: galleryStore.clearGallery,
  };
}