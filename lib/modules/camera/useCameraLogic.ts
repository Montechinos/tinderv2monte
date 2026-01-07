import { useState, useRef } from 'react';
import { CameraView, CameraType } from 'expo-camera';

export function useCameraLogic() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        setPhoto(photo.uri);
      }
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return {
    facing,
    photo,
    cameraRef,
    takePicture,
    retakePhoto,
    toggleCameraFacing,
    setPhoto,
  };
}