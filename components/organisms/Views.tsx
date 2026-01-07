import { View, Text, TouchableOpacity } from 'react-native';
import { CameraView as ExpoCameraView } from 'expo-camera';
import { CameraButton, IconButton } from '../atoms/Buttons';

interface CameraViewComponentProps {
  cameraRef: any;
  facing: 'front' | 'back';
  onCapture: () => void;
  onFlip: () => void;
  onGallery: () => void;
}

export function CameraViewComponent({ 
  cameraRef, 
  facing, 
  onCapture, 
  onFlip,
  onGallery 
}: CameraViewComponentProps) {
  return (
    <ExpoCameraView ref={cameraRef} className="flex-1" facing={facing}>
      <View className="absolute top-12 right-5 z-10">
        <TouchableOpacity onPress={onGallery} className="bg-purple-600 px-6 py-3 rounded-full">
          <Text className="text-white font-bold">Ver Galería</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-end pb-10">
        <View className="flex-row justify-around items-center px-8">
          <View className="w-16" />
          <CameraButton onPress={onCapture} />
          <IconButton onPress={onFlip} icon="🔄" />
        </View>
      </View>
    </ExpoCameraView>
  );
}

interface FeedbackOverlayProps {
  direction: 'left' | 'right';
}

export function FeedbackOverlay({ direction }: FeedbackOverlayProps) {
  return (
    <View className="absolute inset-0 justify-center items-center z-50">
      <View className={`w-36 h-36 rounded-full justify-center items-center shadow-2xl ${
        direction === 'right' ? 'bg-green-500' : 'bg-red-500'
      }`}>
        <Text className="text-white text-7xl font-bold">
          {direction === 'right' ? '✓' : '✗'}
        </Text>
      </View>
    </View>
  );
}

interface EmptyStateProps {
  message: string;
  icon: string;
}

export function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <View className="flex-1 justify-center items-center px-10">
      <Text className="text-6xl mb-4">{icon}</Text>
      <Text className="text-white text-xl text-center">{message}</Text>
    </View>
  );
}