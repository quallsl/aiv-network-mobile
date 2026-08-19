import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth-context";
import { colors, radius, spacing } from "@/constants/theme";

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
    console.log("[delete] starting deletion for", email);

    try {
      const res = await fetch(`${API_BASE}/api/account/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, email }),
      });

      console.log("[delete] fetch completed, status:", res.status);
      const data = await res.json();
      console.log("[delete] response:", JSON.stringify(data));

      if (!res.ok) {
        Alert.alert("Error", String(data?.error || "Failed to delete account."));
        setDeleting(false);
        return;
      }

      console.log("[delete] account deleted, now signing out locally");

      // Account is confirmed deleted server-side. Now clear the local
      // session — this must happen AFTER deletion completes, not
      // before, so we have a confirmed success before changing state.
      await signOut();

      console.log("[delete] signOut complete, navigating");
      router.replace("/(auth)/login");
    } catch (err) {
      console.error("[delete] error:", err);
      Alert.alert("Error", "Something went wrong. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      <Text style={styles.email}>{userEmail}</Text>

      <Pressable style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>

      <View style={styles.divider} />

      <Text style={styles.dangerHeading}>Danger Zone</Text>
      <Text style={styles.dangerText}>
        Deleting your account permanently removes your login and personal
        information. If you have submitted films, they will remain
        available on AIV Network for up to 180 days before being removed.
      </Text>

      <Pressable
        style={deleting ? [styles.deleteButton, styles.deleteButtonDisabled] : styles.deleteButton}
        onPress={confirmDelete}
        disabled={deleting}
      >
        <Text style={styles.deleteText}>
          {deleting ? "Deleting..." : "Delete Account"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  heading: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: spacing.md,
  },
  email: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: spacing.lg,
  },
  signOutButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
  },
  signOutText: {
    color: colors.text,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xl,
  },
  dangerHeading: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  dangerText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: spacing.lg,
  },
  deleteButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
  },
  deleteButtonDisabled: {
    opacity: 0.6,
  },
  deleteText: {
    color: colors.text,
    fontWeight: "700",
  },
});