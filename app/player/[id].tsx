import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { supabase, Film } from "@/lib/supabase";
import { getBunnyStreamUrl, isYouTubeUrl } from "@/lib/bunny";
import VideoPlayer from "@/components/VideoPlayer";
import { colors, spacing } from "@/constants/theme";
import { IS_TV, pick, tvSafe, tvType } from "@/constants/tv";

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
  // (phones/iPads only — Apple TV has no orientation)
  useEffect(() => {
    if (IS_TV) return;
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

        {/* On Apple TV the Siri Remote Back/Menu button exits the player,
            so the small on-screen ✕ is phone-only. */}
        {!IS_TV && (
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={12}
          >
            <Text style={styles.backButtonText}>✕</Text>
          </Pressable>
        )}
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
    fontSize: pick(14, tvType.body),
  },
  details: {
    paddingHorizontal: pick(spacing.lg, tvSafe.horizontal),
    paddingVertical: pick(spacing.lg, 48),
    maxWidth: pick(undefined, 1400),
  },
  title: {
    color: colors.text,
    fontSize: pick(20, tvType.heading),
    fontWeight: "700",
    marginBottom: pick(spacing.xs, 16),
  },
  meta: {
    color: colors.textMuted,
    fontSize: pick(13, tvType.body),
    marginBottom: pick(spacing.md, 28),
  },
  description: {
    color: colors.textMuted,
    fontSize: pick(14, tvType.body),
    lineHeight: pick(20, 42),
  },
});