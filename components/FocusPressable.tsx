import React, { useState } from "react";
import {
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
  focused: {
    borderColor: "#ffffff",
    borderWidth: 3,
  },
});
