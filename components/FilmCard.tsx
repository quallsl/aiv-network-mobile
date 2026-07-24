import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Film } from "@/lib/supabase";
import { getBunnyThumbnail, isYouTubeUrl } from "@/lib/bunny";
import { colors, radius, spacing } from "@/constants/theme";

const FALLBACK_THUMBNAIL = "https://via.placeholder.com/320x180?text=No+Preview";

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

export default function FilmCard({ film }: { film: Film }) {
  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/player/${film.id}`)}
    >
      <Image source={{ uri: getThumbnail(film) }} style={styles.thumbnail} />
      <Text style={styles.title} numberOfLines={1}>
        {film.title || "Untitled Film"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    marginRight: spacing.sm,
  },
  thumbnail: {
    width: 140,
    height: 84,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  title: {
    color: colors.text,
    fontSize: 13,
    marginTop: spacing.xs,
  },
});
