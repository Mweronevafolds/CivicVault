import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';

// This is the web version of the HapticTab.
// It uses PlatformPressable without any haptics, making it web-compatible.
export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable {...props} />
  );
}
