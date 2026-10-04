import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth-context";
import FocusPressable from "@/components/FocusPressable";
import { colors, radius, spacing } from "@/constants/theme";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL as string;

export default function SettingsScreen() {
  const { session, signOut } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const userEmail = session?.user?.email ?? "";
  const signedIn = Boolean(session?.user);

  function confirmDelete() {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and login credentials. This cannot be undone. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete Account", style: "destructive", onPress: handleDelete },
      ],
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

      // Account is confirmed deleted server-side; only now clear the local session.
      await signOut();
      router.replace("/(auth)/login");
    } catch (err) {
      console.error("[delete] error:", err);
      Alert.alert("Error", "Something went wrong. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.column}>
        <Text style={styles.heading}>Settings</Text>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>ACCOUNT</Text>

          {signedIn ? (
            <>
              <Text style={styles.rowLabel}>Signed in as</Text>
              <Text style={styles.email}>{userEmail}</Text>

              <FocusPressable style={styles.secondaryButton} onPress={signOut}>
                <Text style={styles.buttonText}>Sign Out</Text>
              </FocusPressable>
            </>
          ) : (
            <>
              <Text style={styles.email}>Browsing as guest</Text>

              <FocusPressable
                style={styles.primaryButton}
                onPress={() => router.push("/(auth)/login")}
              >
                <Text style={styles.buttonText}>Sign In</Text>
              </FocusPressable>
            </>
          )}
        </View>

        {signedIn && (
          <View style={[styles.card, styles.dangerCard]}>
            <Text style={[styles.sectionLabel, styles.dangerLabel]}>DANGER ZONE</Text>

            <Text style={styles.dangerText}>
              Deleting your account permanently removes your login and personal information.
              If you have submitted films, they will remain available on AIV Network for up to
              180 days before being removed.
            </Text>

            <FocusPressable
              style={[styles.primaryButton, deleting && styles.buttonDisabled]}
              onPress={confirmDelete}
              disabled={deleting}
            >
              <Text style={styles.buttonText}>{deleting ? "Deleting..." : "Delete Account"}</Text>
            </FocusPressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    alignItems: "center",
  },
  column: {
    width: "100%",
    maxWidth: 720,
  },
  heading: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  dangerCard: {
    borderColor: colors.accent,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  dangerLabel: {
    color: colors.accent,
  },
  rowLabel: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: spacing.xs,
  },
  email: {
    color: colors.text,
    fontSize: 16,
    marginBottom: spacing.lg,
  },
  dangerText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.lg,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 15,
  },
});