import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useAuth } from "@/lib/auth-context";
import { startStripeOnboarding } from "@/lib/stripe";
import { colors, radius, spacing } from "@/constants/theme";

export default function PayoutsScreen() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleOnboarding() {
    if (!session?.user) return;

    setLoading(true);
    const url = await startStripeOnboarding(session.user.id, session.user.email ?? "");
    setLoading(false);

    if (url) {
      await WebBrowser.openBrowserAsync(url);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Payouts</Text>
      <Text style={styles.subtext}>
        Connect a Stripe account to receive your share of ad revenue from views on your films.
      </Text>

      <Pressable style={styles.button} onPress={handleOnboarding} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : "Set Up Stripe Payouts"}
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
    fontSize: 22,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  subtext: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
  },
  buttonText: {
    color: colors.text,
    fontWeight: "700",
  },
});
