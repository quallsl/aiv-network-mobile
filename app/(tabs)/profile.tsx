import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth-context";
import { colors, radius, spacing } from "@/constants/theme";
import { pick, tvType } from "@/constants/tv";
import FocusPressable from "@/components/FocusPressable";

export default function ProfileScreen() {
  const { session, signOut } = useAuth();

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.subtext}>Sign in to manage your account.</Text>
        <FocusPressable
          style={styles.button}
          onPress={() => router.push("/(auth)/login")}
          hasTVPreferredFocus
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </FocusPressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.email}>{session.user.email}</Text>

      <FocusPressable style={styles.button} onPress={signOut} hasTVPreferredFocus>
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
    minHeight: pick(44, tvType.controlHeight),
    minWidth: pick(0, 420),
    backgroundColor: colors.accent,
    borderRadius: pick(radius.md, 12),
    paddingVertical: pick(spacing.md, 20),
    paddingHorizontal: pick(spacing.xl, 48),
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: pick(15, tvType.body),
  },
});