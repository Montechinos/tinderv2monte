import "@/global.css";
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const profiles = [
  { id: 1, name: 'María', age: 28, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop' },
  { id: 2, name: 'Carlos', age: 32, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop' },
  { id: 3, name: 'Ana', age: 25, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1000&fit=crop' },
  { id: 4, name: 'Diego', age: 29, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1000&fit=crop' },
  { id: 5, name: 'Laura', age: 27, image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop' }
];

export default function TinderSwipeApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'left' | 'right' | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-30deg', '0deg', '30deg'],
    extrapolate: 'clamp',
  });

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

  const forceSwipe = (direction: 'left' | 'right') => {
    const x = direction === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setShowFeedback(direction);
      
      setTimeout(() => {
        onSwipeComplete();
        setShowFeedback(null);
      }, 1500);
    });
  };

  const onSwipeComplete = () => {
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev + 1) % profiles.length);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const getCardStyle = () => {
    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };

  const currentProfile = profiles[currentIndex];

  return (
    <LinearGradient
      colors={['#581c87', '#be185d', '#e11d48']}
      className="flex-1 pt-16 pb-10 px-5"
    >
      <View className="items-center mb-8">
        <Text className="text-4xl font-bold text-white mb-2">SwipeMatch</Text>
        <Text className="text-base text-purple-200">Desliza para conectar</Text>
      </View>

      <View className="flex-1 justify-center items-center">
        {showFeedback && (
          <View className="absolute inset-0 justify-center items-center z-50">
            <View className={`w-36 h-36 rounded-full justify-center items-center shadow-2xl ${
              showFeedback === 'right' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <Text className="text-white text-7xl font-bold">
                {showFeedback === 'right' ? '✓' : '✗'}
              </Text>
            </View>
          </View>
        )}

        <Animated.View
          {...panResponder.panHandlers}
          style={[
            getCardStyle(),
            { width: SCREEN_WIDTH - 40, height: SCREEN_HEIGHT * 0.65 }
          ]}
          className="rounded-3xl overflow-hidden bg-white shadow-2xl"
        >
          <Image
            source={{ uri: currentProfile.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            className="absolute left-0 right-0 bottom-0 justify-end p-6"
            style={{ height: '50%' }}
          >
            <View className="mb-5">
              <Text className="text-3xl font-bold text-white mb-1">
                {currentProfile.name}
              </Text>
              <Text className="text-xl text-gray-200">
                {currentProfile.age} años
              </Text>
            </View>
          </LinearGradient>

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
      </View>

      <View className="items-center mt-8">
        <Text className="text-purple-200 text-sm text-center">
          ← Desliza izquierda para rechazar | Desliza derecha para aceptar →
        </Text>
      </View>
    </LinearGradient>
  );
}