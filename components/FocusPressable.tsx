import React, { useState } from "react";
import {
  Platform,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";

type Props = Omit<PressableProps, "style"> & {
  style?: StyleProp<ViewStyle>;
  focusedStyle?: StyleProp<ViewStyle> | null;
};

// Shows which item the Siri Remote is on (Apple TV). Phones never focus, so no visual change there.
// Pass focusedStyle={null} to turn the ring off for a specific item.
export default function FocusPressable({
  style,
  focusedStyle,
  onFocus,
  onBlur,
  ...rest
}: Props) {
  const [focused, setFocused] = useState(false);
  const ring = focusedStyle === undefined ? styles.focused : focusedStyle;
  return (
    <Pressable
      {...rest}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      style={[style, focused && ring]}
    />
  );
}

const styles = StyleSheet.create({
  focused: Platform.isTV
    ? {
        // Apple TV: thick white ring + slight lift so it's obvious from across the room
        borderColor: "#ffffff",
        borderWidth: 4,
        transform: [{ scale: 1.06 }],
      }
    : {
        borderColor: "#ffffff",
        borderWidth: 3,
      },
});
