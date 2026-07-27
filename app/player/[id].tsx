import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
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

  // Allow rotation while this screen is open; lock back to portrait on leaving
  useEffect(() => {
    ScreenOrientation.unlockAsync();
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

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
      <View style={styles.videoWrapper}>
        <VideoPlayer streamUrl={streamUrl} filmId={film.id} />

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={12}
        >
          <Text style={styles.backButtonText}>✕</Text>
        </Pressable>
      </View>

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
  videoWrapper: {
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 44,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  backButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
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
