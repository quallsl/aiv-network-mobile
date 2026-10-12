import { Platform } from "react-native";

// true only on Apple TV / Android TV builds
export const IS_TV = Platform.isTV;

// tvOS overscan-safe margins (points, 1920x1080 canvas)
export const tvSafe = { horizontal: 80, vertical: 60 };

// 10-foot type and control sizes
export const tvType = {
  body: 29,
  small: 24,
  title: 38,
  heading: 48,
  controlHeight: 80,
};

// Returns the phone value normally, the TV value on Apple TV.
export function pick<T>(phone: T, tvValue: T): T {
  return IS_TV ? tvValue : phone;
}