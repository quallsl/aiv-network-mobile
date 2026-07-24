import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/constants/theme";

// TODO(Phase 3): build the actual upload flow —
//   1. expo-document-picker or expo-image-picker (video mode) to select a file
//   2. Upload directly to Bunny Stream's API (same pattern as the web
//      submission form), showing upload progress
//   3. Insert the resulting videoId + metadata into Supabase `films` table
//      with status: "pending" for moderation, matching the web app's flow
export default function SubmitFilmScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Film submission upload flow — coming in Phase 3.</Text>
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
