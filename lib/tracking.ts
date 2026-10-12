import { AppState, Platform } from "react-native";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";

let asked: Promise<void> | null = null;

// iOS ignores the ATT prompt unless the app is in the foreground.
function waitUntilActive(): Promise<void> {
  if (AppState.currentState === "active") return Promise.resolve();
  return new Promise((resolve) => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        sub.remove();
        resolve();
      }
    });
  });
}

/**
 * Shows Apple's App Tracking Transparency prompt once, on iPhone/iPad only,
 * BEFORE any ad is requested (App Review Guideline 5.1.2(i)).
 * Apple TV never tracks (AdMob isn't in the TV build), so it's skipped there.
 * Safe to call before every ad — the prompt only ever appears once.
 * Ads still serve if the user says no; they're just not personalized.
 */
export function ensureTrackingPermission(): Promise<void> {
  if (Platform.OS !== "ios" || Platform.isTV) return Promise.resolve();

  if (!asked) {
    asked = waitUntilActive()
      .then(() => requestTrackingPermissionsAsync())
      .then(({ status }) => {
        console.log("[att] tracking permission:", status);
      })
      .catch((err) => {
        console.warn("[att] tracking request failed:", err);
      });
  }
  return asked;
}