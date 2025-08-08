import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from './IconSymbol';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
}

export function CustomToast({ message, type, isVisible }: ToastProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: insets.top, 
          speed: 10,
          bounciness: 5,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, fadeAnim, slideAnim, insets.top]);

  const backgroundColor = type === 'success' ? '#28a745' : '#dc3545';
  const iconName = type === 'success' ? 'checkmark.circle.fill' : 'xmark.circle.fill';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim, 
          transform: [{ translateY: slideAnim }],
          backgroundColor,
        },
      ]}>
      <IconSymbol name={iconName} color="#fff" size={22} />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, 
    left: 20,
    right: 20,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 9999,
  },
  message: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 12,
    fontSize: 16,
    flexShrink: 1, 
  },
});