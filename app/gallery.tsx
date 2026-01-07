import React, { useState, useRef } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useGalleryStore } from '@/lib/store/galleryStore';
import { useSwipeLogic } from '@/lib/ui/useSwipeLogic';
import { SwipeCard } from '@/components/molecules/Cards';
import { FeedbackOverlay, EmptyState } from '@/components/organisms/Views';
import { Camera, ArrowLeft, X as XIcon } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const imageSize = (width - 40) / 3;

export default function GalleryScreen() {
  const router = useRouter();
  const { photos, removePhoto } = useGalleryStore();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const handleSwipeComplete = (direction: 'left' | 'right') => {
    if (selectedPhotoIndex === null) return;
    
    if (direction === 'left') {
      removePhoto(selectedPhotoIndex);
      setSelectedPhotoIndex(null);
    } else {
      if (selectedPhotoIndex < photos.length - 1) {
        setSelectedPhotoIndex(selectedPhotoIndex + 1);
      } else {
        setSelectedPhotoIndex(0);
      }
    }
  };

  const {
    position,
    swipeDirection,
    showFeedback,
    setSwipeDirection,
    forceSwipe,
    resetPosition,
    getCardStyle,
  } = useSwipeLogic(handleSwipeComplete);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
        if (gesture.dx > 50) {
          setSwipeDirection('right');
        } else if (gesture.dx < -50) {
          setSwipeDirection('left');
        } else {
          setSwipeDirection(null);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120) {
          forceSwipe('right');
        } else if (gesture.dx < -120) {
          forceSwipe('left');
        } else {
          resetPosition();
          setSwipeDirection(null);
        }
      },
    })
  ).current;

  // Vista Swipe (cuando seleccionas una foto)
  if (selectedPhotoIndex !== null && photos[selectedPhotoIndex]) {
    return (
      <LinearGradient
        colors={['#581c87', '#be185d', '#e11d48']}
        className="flex-1 pt-16 pb-10 px-5"
      >
        <View className="absolute top-12 right-5 z-50">
          <TouchableOpacity
            onPress={() => setSelectedPhotoIndex(null)}
            className="bg-red-500 w-12 h-12 rounded-full justify-center items-center"
          >
            <XIcon color="white" size={24} />
          </TouchableOpacity>
        </View>

        <View className="flex-1 justify-center items-center mt-12">
          {showFeedback && <FeedbackOverlay direction={showFeedback} />}

          <View {...panResponder.panHandlers}>
            <SwipeCard
              imageUri={photos[selectedPhotoIndex]}
              style={getCardStyle()}
              swipeDirection={swipeDirection}
              showFeedback={!!showFeedback}
            />
          </View>
        </View>

        <View className="items-center mt-8">
          <Text className="text-purple-200 text-sm text-center mb-4">
            ← Desliza izquierda para eliminar | Desliza derecha para siguiente →
          </Text>
          <Text className="text-white text-base">
            Foto {selectedPhotoIndex + 1} de {photos.length}
          </Text>
        </View>
      </LinearGradient>
    );
  }

  // Vista Grid (default)
  return (
    <LinearGradient
      colors={['#581c87', '#be185d', '#e11d48']}
      className="flex-1 pt-16"
    >
      <View className="px-5 mb-5 flex-row justify-between items-center">
        <View>
          <Text className="text-3xl font-bold text-white mb-2">Galería</Text>
          <Text className="text-purple-200">{photos.length} fotos</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-pink-600 px-6 py-3 rounded-full flex-row items-center gap-2"
        >
          <ArrowLeft color="white" size={20} />
          <Text className="text-white font-bold">Volver</Text>
        </TouchableOpacity>
      </View>

      {photos.length === 0 ? (
        <EmptyState message="No hay fotos aún" icon={<Camera color="white" size={80} />} />
      ) : (
        <FlatList
          data={photos}
          numColumns={3}
          contentContainerStyle={{ padding: 10 }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => setSelectedPhotoIndex(index)}
              className="m-1"
              style={{ width: imageSize }}
            >
              <Image
                source={{ uri: item }}
                className="w-full rounded-lg"
                style={{ height: imageSize }}
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  removePhoto(index);
                }}
                className="absolute -top-2 -right-2 bg-red-500 w-8 h-8 rounded-full justify-center items-center border-2 border-white"
              >
                <XIcon color="white" size={20} strokeWidth={3} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </LinearGradient>
  );
}