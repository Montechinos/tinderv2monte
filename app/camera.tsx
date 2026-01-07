import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useGalleryStore } from '@/lib/store/galleryStore';
import { RefreshCw, X, Check } from 'lucide-react-native';

export default function CameraScreen() {
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const { addPhoto } = useGalleryStore();

  if (!permission) {
    return <View className="flex-1 bg-black" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-purple-900 p-5">
        <Text className="text-white text-center text-lg mb-5">
          Necesitamos tu permiso para usar la cámara
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-pink-600 px-8 py-3 rounded-full"
        >
          <Text className="text-white font-bold">Dar Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        setPhoto(photo.uri);
      }
    }
  };

  const savePhoto = () => {
    if (photo) {
      addPhoto(photo);
      setPhoto(null);
      router.push('/');
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (photo) {
    return (
      <View className="flex-1 bg-black">
        <Image source={{ uri: photo }} className="flex-1" resizeMode="cover" />
        <View className="absolute bottom-0 left-0 right-0 flex-row justify-around p-8 bg-black/50">
          <TouchableOpacity
            onPress={retakePhoto}
            className="bg-red-500 px-8 py-4 rounded-full flex-row items-center gap-2"
          >
            <X color="white" size={24} />
            <Text className="text-white font-bold text-lg">Repetir</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={savePhoto}
            className="bg-green-500 px-8 py-4 rounded-full flex-row items-center gap-2"
          >
            <Check color="white" size={24} />
            <Text className="text-white font-bold text-lg">Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing}>
        <View className="absolute top-12 right-5 z-50">
          <TouchableOpacity
            onPress={() => router.push('/gallery')}
            className="bg-purple-600 px-6 py-3 rounded-full"
          >
            <Text className="text-white font-bold">Ver Galería</Text>
          </TouchableOpacity>
        </View>

        <View className="absolute bottom-10 left-0 right-0 flex-row justify-around items-center px-8">
          <View className="w-16" />

          <TouchableOpacity
            onPress={takePicture}
            className="w-20 h-20 bg-white rounded-full border-4 border-white/50"
          />

          <TouchableOpacity
            onPress={toggleCameraFacing}
            className="w-16 h-16 bg-white/30 rounded-xl justify-center items-center"
          >
            <RefreshCw color="white" size={32} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}