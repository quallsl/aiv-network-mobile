import React from "react";
import { Stack, router } from "expo-router";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";
import { colors } from "@/constants/theme";

export default function FilmmakerLayout() {
  const { session, loading } = useAuth();

  useEffect(() => {
    // Filmmaker tools (submissions, payouts) require an account —
    // browsing/viewing does not. Redirect to login if not signed in.
    if (!loading && !session) {
      router.replace("/(auth)/login");
    }
  }, [session, loading]);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Filmmaker Dashboard" }} />
      <Stack.Screen name="submit" options={{ title: "Submit Film" }} />
      <Stack.Screen name="payouts" options={{ title: "Payouts" }} />
    </Stack>
  );
}
