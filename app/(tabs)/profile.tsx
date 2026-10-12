import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth-context";
import FocusPressable from "@/components/FocusPressable";
import { colors, radius, spacing } from "@/constants/theme";
import { IS_TV, pick, tvType } from "@/constants/tv";

export default function ProfileScreen() {
  const { session, signOut } = useAuth();

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.subtext}>Sign in to manage your account.</Text>
        <FocusPressable
          style={styles.button}
          hasTVPreferredFocus={IS_TV}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </FocusPressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.email}>{session.user.email}</Text>

      <FocusPressable
        style={styles.button}
        hasTVPreferredFocus={IS_TV}
        onPress={signOut}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </FocusPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: pick(spacing.lg, 80),
    justifyContent: "center",
    alignItems: "center",
  },
  email: {
    color: colors.text,
    fontSize: pick(16, tvType.title),
    marginBottom: pick(spacing.lg, 48),
  },
  subtext: {
    color: colors.textMuted,
    fontSize: pick(15, tvType.body),
    marginBottom: pick(spacing.lg, 48),
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: pick(radius.md, 12),
    paddingVertical: pick(spacing.md, 20),
    paddingHorizontal: pick(spacing.xl, 64),
    ...(IS_TV
      ? {
          minHeight: tvType.controlHeight,
          minWidth: 400,
          alignItems: "center" as const,
          justifyContent: "center" as const,
        }
      : {}),
  },
  buttonText: {
    color: colors.text,
    fontWeight: "700",
    ...(IS_TV ? { fontSize: tvType.body } : {}),
  },
});
