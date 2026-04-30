import { useRef, useCallback } from 'react';
import { Animated } from 'react-native';

/**
 * Returns an Animated.Value and handlers for a press-scale animation.
 * press: 100ms down / 180ms up
 */
export function usePressAnimation(toScale = 0.97) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.timing(scale, {
      toValue: toScale,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [scale, toScale]);

  const onPressOut = useCallback(() => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}
