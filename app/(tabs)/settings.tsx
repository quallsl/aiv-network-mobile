import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth-context";
import FocusPressable from "@/components/FocusPressable";
import { colors, radius, spacing } from "@/constants/theme";
import { IS_TV, pick, tvSafe, tvType } from "@/constants/tv";

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

              <FocusPressable
                style={styles.secondaryButton}
                hasTVPreferredFocus={IS_TV}
                onPress={signOut}
              >
                <Text style={styles.buttonText}>Sign Out</Text>
              </FocusPressable>
            </>
          ) : (
            <>
              <Text style={styles.email}>Browsing as guest</Text>

              <FocusPressable
                style={styles.primaryButton}
                hasTVPreferredFocus={IS_TV}
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

// Apple TV: buttons sized for the remote; phones unchanged
const tvButton = IS_TV
  ? {
      minHeight: tvType.controlHeight,
      justifyContent: "center" as const,
      alignSelf: "flex-start" as const,
      minWidth: 420,
      paddingHorizontal: 48,
    }
  : {};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: pick(spacing.lg, 0),
    paddingHorizontal: pick(spacing.lg, tvSafe.horizontal),
    paddingVertical: pick(spacing.lg, tvSafe.vertical),
    alignItems: "center",
  },
  column: {
    width: "100%",
    maxWidth: pick(720, 1100),
  },
  heading: {
    color: colors.text,
    fontSize: pick(28, tvType.heading),
    fontWeight: "700",
    marginBottom: pick(spacing.lg, 40),
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: pick(radius.md, 16),
    padding: pick(spacing.lg, 40),
    marginBottom: pick(spacing.lg, 40),
  },
  dangerCard: {
    borderColor: colors.accent,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: pick(12, tvType.small),
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: pick(spacing.md, 24),
  },
  dangerLabel: {
    color: colors.accent,
  },
  rowLabel: {
    color: colors.textMuted,
    fontSize: pick(13, tvType.small),
    marginBottom: pick(spacing.xs, 8),
  },
  email: {
    color: colors.text,
    fontSize: pick(16, tvType.body),
    marginBottom: pick(spacing.lg, 32),
  },
  dangerText: {
    color: colors.textMuted,
    fontSize: pick(14, tvType.body),
    lineHeight: pick(21, 42),
    marginBottom: pick(spacing.lg, 32),
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: pick(radius.md, 12),
    paddingVertical: pick(spacing.md, 20),
    alignItems: "center",
    ...tvButton,
  },
  secondaryButton: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: pick(radius.md, 12),
    paddingVertical: pick(spacing.md, 20),
    alignItems: "center",
    ...tvButton,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: pick(15, tvType.body),
  },
});
