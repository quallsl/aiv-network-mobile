import React, { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Film } from "@/lib/supabase";
import { getBunnyThumbnail, isYouTubeUrl } from "@/lib/bunny";
import { colors, radius, spacing } from "@/constants/theme";
import { pick, tvSafe, tvType } from "@/constants/tv";
import FocusPressable from "@/components/FocusPressable";

// Bundled local fallback — no network dependency, so it can't itself 404
const FALLBACK_THUMBNAIL = require("../assets/images/film.placeholder.png");

const COLUMNS = pick(3, 5);
const GRID_PADDING = pick(spacing.lg, tvSafe.horizontal);
const CARD_GAP = pick(spacing.md, 48);

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH =
  (SCREEN_WIDTH - GRID_PADDING * 2 - CARD_GAP * (COLUMNS - 1)) / COLUMNS;

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
    <FocusPressable
      style={styles.card}
      onPress={() => router.push(`/player/${film.id}`)}
    >
      <Image
        source={source}
        style={styles.thumbnail}
        resizeMode="cover"
        onError={() => setUri(null)}
      />
      <Text style={styles.title} numberOfLines={1}>
        {film.title || "Untitled Film"}
      </Text>
    </FocusPressable>
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
    marginBottom: pick(spacing.lg, tvSafe.vertical),
    paddingHorizontal: GRID_PADDING,
  },
  heading: {
    color: colors.text,
    fontSize: pick(18, tvType.title),
    fontWeight: "700",
    marginBottom: pick(spacing.sm, 28),
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    marginBottom: pick(spacing.md, 24),
    borderRadius: pick(radius.md, 14),
    padding: pick(0, 6),
  },
  thumbnail: {
    width: "100%",
    height: CARD_WIDTH * 0.5625, // 16:9
    borderRadius: pick(radius.md, 10),
    backgroundColor: colors.surface,
  },
  title: {
    color: colors.text,
    fontSize: pick(12, tvType.small),
    marginTop: pick(spacing.xs, 12),
  },
});