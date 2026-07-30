import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Film } from "@/lib/supabase";
import { getBunnyThumbnail, isYouTubeUrl } from "@/lib/bunny";
import { colors, radius, spacing } from "@/constants/theme";

// Bundled local fallback — no network dependency, so it can't itself 404
const FALLBACK_THUMBNAIL = require("@/assets/film-placeholder.png");
const COLUMNS = 3;

function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/]+)/
  );
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

function getThumbnail(film: Film): string | null {
  const url = film.video_url || "";
  return (
    film.thumbnail_url ||
    (isYouTubeUrl(url) ? getYouTubeThumbnail(url) : null) ||
    getBunnyThumbnail(url) ||
    null
  );
}

function FilmCard({ film }: { film: Film }) {
  const [uri, setUri] = useState<string | null>(getThumbnail(film));

  // uri === null means we've fallen back to the bundled local image
  const source = uri ? { uri } : FALLBACK_THUMBNAIL;

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/player/${film.id}`)}
    >
      <Image
        source={source}
        style={styles.thumbnail}
        onError={() => setUri(null)}
      />
      <Text style={styles.title} numberOfLines={1}>
        {film.title || "Untitled Film"}
      </Text>
    </Pressable>
  );
}

export default function FilmGrid({ title, films }: { title: string; films: Film[] }) {
  if (films.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>{title}</Text>

      <View style={styles.grid}>
        {films.map((film) => (
          <FilmCard key={film.id} film={film} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  heading: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: `${100 / COLUMNS - 3}%`,
    marginBottom: spacing.md,
  },
  thumbnail: {
    width: "100%",
    aspectRatio: 16 / 10,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  title: {
    color: colors.text,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});