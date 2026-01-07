import { View, Image, Animated, Dimensions, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DeleteButton } from '../atoms/Buttons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SwipeCardProps {
  imageUri: string;
  style?: any;
  swipeDirection?: 'left' | 'right' | null;
  showFeedback?: boolean;
}

export function SwipeCard({ imageUri, style, swipeDirection, showFeedback }: SwipeCardProps) {
  return (
    <Animated.View
      style={[
        style,
        { width: SCREEN_WIDTH - 40, height: SCREEN_HEIGHT * 0.65 }
      ]}
      className="rounded-3xl overflow-hidden bg-white shadow-2xl"
    >
      <Image
        source={{ uri: imageUri }}
        className="w-full h-full"
        resizeMode="cover"
      />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.5)']}
        className="absolute left-0 right-0 bottom-0"
        style={{ height: '30%' }}
      />

      {swipeDirection === 'right' && !showFeedback && (
        <View className="absolute top-12 right-12" style={{ transform: [{ rotate: '12deg' }] }}>
          <View className="w-20 h-20 rounded-full bg-green-500 border-4 border-white justify-center items-center shadow-xl">
            <Text className="text-5xl font-bold text-white">✓</Text>
          </View>
        </View>
      )}

      {swipeDirection === 'left' && !showFeedback && (
        <View className="absolute top-12 left-12" style={{ transform: [{ rotate: '-12deg' }] }}>
          <View className="w-20 h-20 rounded-full bg-red-500 border-4 border-white justify-center items-center shadow-xl">
            <Text className="text-5xl font-bold text-white">✗</Text>
          </View>
        </View>
      )}
    </Animated.View>
  );
}

interface PhotoCardProps {
  uri: string;
  size: number;
  onDelete: () => void;
}

export function PhotoCard({ uri, size, onDelete }: PhotoCardProps) {
  return (
    <View className="m-1" style={{ width: size }}>
      <Image
        source={{ uri }}
        className="w-full rounded-lg"
        style={{ height: size }}
        resizeMode="cover"
      />
      <DeleteButton onPress={onDelete} />
    </View>
  );
}