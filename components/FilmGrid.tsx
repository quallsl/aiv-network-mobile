import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Film } from "@/lib/supabase";
import { getBunnyThumbnail, isYouTubeUrl } from "@/lib/bunny";
import { colors, radius, spacing } from "@/constants/theme";

const FALLBACK_THUMBNAIL = "https://via.placeholder.com/320x180?text=No+Preview";
const COLUMNS = 3;
const MAX_ITEMS = 6; // 3 columns x 2 rows, mirrors the web grid's 2-row concept

function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/]+)/
  );
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

function getThumbnail(film: Film): string {
  const url = film.video_url || "";
  return (
    film.thumbnail_url ||
    (isYouTubeUrl(url) ? getYouTubeThumbnail(url) : null) ||
    getBunnyThumbnail(url) ||
    FALLBACK_THUMBNAIL
  );
}

export default function FilmGrid({ title, films }: { title: string; films: Film[] }) {
  if (films.length === 0) return null;

  const visible = films.slice(0, MAX_ITEMS);

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>{title}</Text>

      <View style={styles.grid}>
        {visible.map((film) => (
          <Pressable
            key={film.id}
            style={styles.card}
            onPress={() => router.push(`/player/${film.id}`)}
          >
            <Image source={{ uri: getThumbnail(film) }} style={styles.thumbnail} />
            <Text style={styles.title} numberOfLines={1}>
              {film.title || "Untitled Film"}
            </Text>
          </Pressable>
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