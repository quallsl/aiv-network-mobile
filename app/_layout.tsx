import React, { useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
// ...inside RootLayout, add:
useEffect(() => {
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
}, []);

import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { colors } from "@/constants/theme";
import { View } from "react-native";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    // Browsing/viewing is open to everyone (guests can watch, matching the
    // web app). Auth is only required to enter filmmaker screens — that
    // gate lives in app/(tabs)/filmmaker/_layout.tsx, not here. This guard
    // just prevents a logged-in user from seeing the login/signup screens.
    if (session && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [session, loading, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style="light" />
        <RouteGuard>
          <Slot />
        </RouteGuard>
      </View>
    </AuthProvider>
  );
}
