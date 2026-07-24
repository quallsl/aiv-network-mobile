import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/constants/theme";

// TODO: Build out full search/browse UI (genre filters, sort options).
// Home screen already has a working inline search — this screen is the
// dedicated space for a richer discovery experience later.
export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Full search &amp; discovery — coming soon.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  text: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: "center",
  },
});
