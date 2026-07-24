import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth-context";
import { colors, radius, spacing } from "@/constants/theme";

export default function ProfileScreen() {
  const { session, signOut } = useAuth();

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.subtext}>Sign in to manage your account.</Text>
        <Pressable style={styles.button} onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.buttonText}>Sign In</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.email}>{session.user.email}</Text>

      <Pressable style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  email: {
    color: colors.text,
    fontSize: 16,
    marginBottom: spacing.lg,
  },
  subtext: {
    color: colors.textMuted,
    fontSize: 15,
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  buttonText: {
    color: colors.text,
    fontWeight: "700",
  },
});
