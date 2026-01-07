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
    <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing}>
      <View style={{ position: 'absolute', top: 50, right: 20 }}>
        <TouchableOpacity
          onPress={() => router.push('/gallery')}
          className="bg-purple-600 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-bold">Ver Galería</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 40 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 32 }}>
          <View style={{ width: 64 }} />

          <TouchableOpacity
            onPress={takePicture}
            style={{ width: 80, height: 80, backgroundColor: 'white', borderRadius: 40, borderWidth: 4, borderColor: 'rgba(255,255,255,0.5)' }}
          />

          <TouchableOpacity
            onPress={toggleCameraFacing}
            style={{ width: 64, height: 64, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}
          >
            <RefreshCw color="white" size={32} />
          </TouchableOpacity>
        </View>
      </View>
    </CameraView>
  );
}