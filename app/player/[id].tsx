import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { supabase, Film } from "@/lib/supabase";
import { getBunnyStreamUrl, isYouTubeUrl } from "@/lib/bunny";
import VideoPlayer from "@/components/VideoPlayer";
import { colors, spacing } from "@/constants/theme";

export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [film, setFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    supabase
      .from("films")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error) console.error("Failed to load film:", error);
        setFilm(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (!film) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Film not found.</Text>
      </View>
    );
  }

  const streamUrl = isYouTubeUrl(film.video_url)
    ? film.video_url || ""
    : getBunnyStreamUrl(film.video_url);

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: film.title || "Now Playing" }} />

      <VideoPlayer streamUrl={streamUrl} filmId={film.id} />

      <View style={styles.details}>
        <Text style={styles.title}>{film.title || "Untitled Film"}</Text>
        <Text style={styles.meta}>
          {film.creator || "Independent Creator"} · {film.genre || "AI Film"}
          {film.release_year || film.year ? ` · ${film.release_year || film.year}` : ""}
        </Text>
        {film.description && <Text style={styles.description}>{film.description}</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: colors.textMuted,
  },
  details: {
    padding: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: spacing.md,
  },
  description: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
