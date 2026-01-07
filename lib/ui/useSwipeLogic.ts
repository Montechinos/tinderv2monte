import { useState, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function useSwipeLogic(onSwipeComplete: (direction: 'left' | 'right') => void) {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [showFeedback, setShowFeedback] = useState<'left' | 'right' | null>(null);
  const position = useRef(new Animated.ValueXY()).current;

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-30deg', '0deg', '30deg'],
    extrapolate: 'clamp',
  });

  const forceSwipe = (direction: 'left' | 'right') => {
    const x = direction === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setShowFeedback(direction);
      
      setTimeout(() => {
        position.setValue({ x: 0, y: 0 });
        setSwipeDirection(null);
        setShowFeedback(null);
        onSwipeComplete(direction);
      }, 1500);
    });
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

  return {
    position,
    swipeDirection,
    showFeedback,
    setSwipeDirection,
    forceSwipe,
    resetPosition,
    getCardStyle,
  };
}