import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth-context";
import { colors, radius, spacing } from "@/constants/theme";
import { pick, tvSafe, tvType } from "@/constants/tv";
import FocusPressable from "@/components/FocusPressable";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL as string;

export default function SettingsScreen() {
  const { session, signOut } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const userEmail = session?.user?.email ?? "";

  function confirmDelete() {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and login credentials. This cannot be undone. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete Account", style: "destructive", onPress: handleDelete },
      ]
    );
  }

  async function handleDelete() {
    const userId = session?.user?.id;
    const email = session?.user?.email;

    if (!userId || !email) {
      Alert.alert("Error", "No active session found.");
      return;
    }

    setDeleting(true);

    try {
      const res = await fetch(`${API_BASE}/api/account/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", String(data?.error || "Failed to delete account."));
        setDeleting(false);
        return;
      }

      // Confirmed deleted server-side — now clear the local session.
      await signOut();
      router.replace("/(auth)/login");
    } catch (err) {
      console.error("[delete] error:", err);
      Alert.alert("Error", "Something went wrong. Please try again.");
      setDeleting(false);
    }
  }

  // Signed-out state (guests can browse; nothing to manage yet)
  if (!session) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
        <View style={styles.column}>
          <Text style={styles.heading}>Settings</Text>
          <Text style={styles.body}>Sign in to manage your account.</Text>
          <FocusPressable
            style={styles.primaryButton}
            onPress={() => router.push("/(auth)/login")}
            hasTVPreferredFocus
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </FocusPressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.column}>
        <Text style={styles.heading}>Settings</Text>

        <Text style={styles.label}>Signed in as</Text>
        <Text style={styles.email}>{userEmail}</Text>

        <FocusPressable
          style={styles.secondaryButton}
          onPress={signOut}
          hasTVPreferredFocus
        >
          <Text style={styles.buttonText}>Sign Out</Text>
        </FocusPressable>

        <View style={styles.divider} />

        <Text style={styles.dangerHeading}>Delete Account</Text>
        <Text style={styles.body}>
          Deleting your account permanently removes your login and personal
          information. If you have submitted films, they will remain available
          on AIV Network for up to 180 days before being removed.
        </Text>

        <FocusPressable
          style={[styles.dangerButton, deleting && styles.disabled]}
          onPress={confirmDelete}
          disabled={deleting}
        >
          <Text style={styles.buttonText}>
            {deleting ? "Deleting..." : "Delete Account"}
          </Text>
        </FocusPressable>
      </View>
    </ScrollView>
  );
}

const button = {
  minHeight: pick(48, tvType.controlHeight),
  borderRadius: pick(radius.md, 12),
  paddingVertical: pick(spacing.md, 20),
  paddingHorizontal: pick(spacing.lg, 48),
  alignItems: "center" as const,
  justifyContent: "center" as const,
  alignSelf: pick("stretch" as const, "flex-start" as const),
  minWidth: pick(0, 420),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: pick(spacing.lg, 0),
  },
  scroll: {
    paddingHorizontal: pick(0, tvSafe.horizontal),
    paddingVertical: pick(0, tvSafe.vertical),
  },
  // Keeps TV content in a readable column instead of stretched edge-to-edge
  column: {
    width: "100%",
    maxWidth: pick(undefined, 1000),
  },
  heading: {
    color: colors.text,
    fontSize: pick(24, tvType.heading),
    fontWeight: "700",
    marginBottom: pick(spacing.md, 40),
  },
  label: {
    color: colors.textFaint,
    fontSize: pick(12, tvType.small),
    marginBottom: pick(2, 8),
  },
  email: {
    color: colors.textMuted,
    fontSize: pick(14, tvType.body),
    marginBottom: pick(spacing.lg, 40),
  },
  body: {
    color: colors.textMuted,
    fontSize: pick(13, tvType.body),
    lineHeight: pick(19, 42),
    marginBottom: pick(spacing.lg, 40),
  },
  primaryButton: {
    ...button,
    backgroundColor: colors.accent,
  },
  secondaryButton: {
    ...button,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
  },
  dangerButton: {
    ...button,
    backgroundColor: colors.accent,
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: pick(15, tvType.body),
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: pick(spacing.xl, 60),
  },
  dangerHeading: {
    color: colors.accent,
    fontSize: pick(16, tvType.title),
    fontWeight: "700",
    marginBottom: pick(spacing.sm, 20),
  },
});