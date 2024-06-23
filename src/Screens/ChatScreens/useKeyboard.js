import { useState, useEffect } from 'react';
import { Keyboard, LayoutAnimation, Platform } from 'react-native';
import DeviceInfo, { hasDynamicIsland, hasNotch } from 'react-native-device-info';

const useKeyboard = () => {
  const [isKeyboardOpen, setKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const newBottomMargin = (hasNotch() || hasDynamicIsland()) ? 25 : 15

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', e => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardHeight(Platform.OS == 'ios' ? (e.endCoordinates.height + 10) : 10)


      setKeyboardOpen(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardHeight(0);
      setKeyboardOpen(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return { isKeyboardOpen, keyboardHeight, newBottomMargin };
};

export { useKeyboard };
