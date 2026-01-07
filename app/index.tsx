import "@/global.css";
import React, { useState, useRef } from 'react';
import { View, Text, PanResponder, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useGalleryStore } from '@/lib/store/galleryStore';
import { useSwipeLogic } from '@/lib/ui/useSwipeLogic';
import { SwipeCard } from '@/components/molecules/Cards';
import { FeedbackOverlay, EmptyState } from '@/components/organisms/Views';

export default function SwipeGalleryApp() {
  const router = useRouter();
  const { photos, removePhoto } = useGalleryStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipeComplete = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      removePhoto(currentIndex);
    }
    
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
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

  return (
    <LinearGradient
      colors={['#581c87', '#be185d', '#e11d48']}
      className="flex-1 pt-16 pb-10 px-5"
    >
      <View className="items-center mb-8">
        <Text className="text-4xl font-bold text-white mb-2">SwipeMatch</Text>
        <Text className="text-base text-purple-200">Desliza tus fotos</Text>
      </View>

      {photos.length === 0 ? (
        <>
          <EmptyState message="No hay fotos. Toma una foto primero" icon="📸" />
          <View className="items-center mt-8">
            <TouchableOpacity
              onPress={() => router.push('/camera')}
              className="bg-pink-600 px-8 py-4 rounded-full"
            >
              <Text className="text-white font-bold text-lg">Abrir Cámara</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View className="flex-1 justify-center items-center">
            {showFeedback && <FeedbackOverlay direction={showFeedback} />}

            {currentIndex < photos.length && (
              <View {...panResponder.panHandlers}>
                <SwipeCard
                  imageUri={photos[currentIndex]}
                  style={getCardStyle()}
                  swipeDirection={swipeDirection}
                  showFeedback={!!showFeedback}
                />
              </View>
            )}
          </View>

          <View className="items-center mt-8">
            <Text className="text-purple-200 text-sm text-center mb-4">
              ← Desliza izquierda para eliminar | Desliza derecha para guardar →
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/camera')}
              className="bg-purple-600 px-6 py-3 rounded-full"
            >
              <Text className="text-white font-bold">Tomar más fotos</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </LinearGradient>
  );
}