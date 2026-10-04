import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { supabase, Film } from "@/lib/supabase";
import { getBunnyThumbnail, isYouTubeUrl } from "@/lib/bunny";
import FocusPressable from "@/components/FocusPressable";
import { colors, radius, spacing } from "@/constants/theme";

const FALLBACK_THUMBNAIL = require("../../assets/images/film.placeholder.png");

function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/]+)/,
  );
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

function getPoster(film: Film): string | null {
  const url = film.video_url || "";
  return (
    film.thumbnail_url ||
    (isYouTubeUrl(url) ? getYouTubeThumbnail(url) : null) ||
    getBunnyThumbnail(url) ||
    null
  );
}

function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace("/(tabs)");
}

export default function FilmDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [film, setFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);
  const [posterUri, setPosterUri] = useState<string | null>(null);
  const { width } = useWindowDimensions();

  // Side-by-side on TV and wide screens; stacked on phones
  const sideBySide = Platform.isTV || width >= 900;

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
        setPosterUri(data ? getPoster(data) : null);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (!film) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Film not found.</Text>
      </View>
    );
  }

  const year = film.release_year || film.year;
  const meta = [film.creator || "Independent Creator", film.genre || "AI Film", year]
    .filter(Boolean)
    .join("  ·  ");

  // Remote focus starts on Play when the screen opens (Apple TV)
  const preferFocus = Platform.isTV ? ({ hasTVPreferredFocus: true } as any) : {};

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={[styles.layout, sideBySide && styles.layoutRow]}>
        <Image
          source={posterUri ? { uri: posterUri } : FALLBACK_THUMBNAIL}
          onError={() => setPosterUri(null)}
          resizeMode="cover"
          style={[styles.poster, sideBySide && styles.posterRow]}
        />

        <View style={[styles.info, sideBySide && styles.infoRow]}>
          <Text style={styles.title}>{film.title || "Untitled Film"}</Text>
          <Text style={styles.meta}>{meta}</Text>

          <View style={styles.buttons}>
            <FocusPressable
              {...preferFocus}
              style={styles.playButton}
              onPress={() => router.push(`/player/${film.id}`)}
            >
              <Text style={styles.playText}>▶  Play</Text>
            </FocusPressable>

            <FocusPressable style={styles.backButton} onPress={goBack}>
              <Text style={styles.backText}>‹ Back</Text>
            </FocusPressable>
          </View>

          {film.description ? (
            <Text style={styles.description}>{film.description}</Text>
          ) : (
            <Text style={styles.muted}>No description yet.</Text>
          )}
        </View>
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
    paddingTop: Platform.isTV ? spacing.xl : 56,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  layout: {
    width: "100%",
  },
  layoutRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  poster: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  posterRow: {
    width: "48%",
  },
  info: {
    marginTop: spacing.lg,
  },
  infoRow: {
    flex: 1,
    marginTop: 0,
    marginLeft: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: Platform.isTV ? 44 : 24,
    fontWeight: "800",
    marginBottom: spacing.sm,
  },
  meta: {
    color: colors.textMuted,
    fontSize: Platform.isTV ? 22 : 14,
    marginBottom: spacing.lg,
  },
  buttons: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  playButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  playText: {
    color: colors.text,
    fontSize: Platform.isTV ? 24 : 16,
    fontWeight: "800",
  },
  backButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  backText: {
    color: colors.text,
    fontSize: Platform.isTV ? 24 : 16,
    fontWeight: "700",
  },
  description: {
    color: colors.text,
    fontSize: Platform.isTV ? 22 : 15,
    lineHeight: Platform.isTV ? 34 : 22,
  },
  muted: {
    color: colors.textMuted,
    fontSize: Platform.isTV ? 20 : 14,
  },
});