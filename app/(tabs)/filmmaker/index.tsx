import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { colors, radius, spacing } from "@/constants/theme";

// TODO(Phase 3): pull real stats from Supabase (views, earnings, submission
// status) once the filmmaker data model is finalized. Buttons below already
// route to the right screens for submission and payouts.
export default function FilmmakerDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Filmmaker Dashboard</Text>

      <Pressable style={styles.card} onPress={() => router.push("/(tabs)/filmmaker/submit")}>
        <Text style={styles.cardTitle}>Submit a Film</Text>
        <Text style={styles.cardSubtitle}>Upload directly to Bunny Stream</Text>
      </Pressable>

      <Pressable style={styles.card} onPress={() => router.push("/(tabs)/filmmaker/payouts")}>
        <Text style={styles.cardTitle}>Payouts</Text>
        <Text style={styles.cardSubtitle}>Manage your Stripe Connect account</Text>
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
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
