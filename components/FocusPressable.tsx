import React, { useState } from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { IS_TV } from "@/constants/tv";

type Props = Omit<PressableProps, "style" | "children"> & {
  style?: StyleProp<ViewStyle>;
  focusStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

// Drop-in Pressable. On phones it behaves exactly like Pressable.
// On Apple TV it shows a clear focus state (white border + scale-up)
// so every control is easy to find and select with the Siri Remote.
export default function FocusPressable({
  style,
  focusStyle,
  onFocus,
  onBlur,
  children,
  ...rest
}: Props) {
  const [focused, setFocused] = useState(false);

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
      style={[
        style,
        IS_TV && styles.tvBase,
        IS_TV && focused && styles.tvFocused,
        IS_TV && focused && focusStyle,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tvBase: {
    borderWidth: 4,
    borderColor: "transparent",
  },
  tvFocused: {
    borderColor: "#ffffff",
    transform: [{ scale: 1.08 }],
    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
});