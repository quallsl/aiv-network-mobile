import React, { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import FocusPressable from "@/components/FocusPressable";
import { router } from "expo-router";
import { Film } from "@/lib/supabase";
import { getBunnyThumbnail, isYouTubeUrl } from "@/lib/bunny";
import { colors, radius, spacing } from "@/constants/theme";
import { pick, tvSafe, tvType } from "@/constants/tv";

// Bundled local fallback — no network dependency, so it can't itself 404
const FALLBACK_THUMBNAIL = require("../assets/images/film.placeholder.png");

// Phone values unchanged; Apple TV gets 5 columns inside the safe area
const COLUMNS = pick(3, 5);
const GRID_PADDING = pick(spacing.lg, tvSafe.horizontal);
const CARD_GAP = pick(spacing.md, 40);

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH =
  (SCREEN_WIDTH - GRID_PADDING * 2 - CARD_GAP * (COLUMNS - 1)) / COLUMNS;

function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/]+)/,
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
  // uri === null means we've fallen back to the bundled local image
  const [uri, setUri] = useState<string | null>(getThumbnail(film));
  const source = uri ? { uri } : FALLBACK_THUMBNAIL;

  return (
    <FocusPressable
      style={styles.card}
      onPress={() => router.push(`/film/${film.id}`)}
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

export default function FilmGrid({
  title,
  films,
}: {
  title: string;
  films: Film[];
}) {
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
    marginBottom: pick(spacing.sm, 24),
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
    borderRadius: pick(undefined, 12),
  },
  thumbnail: {
    width: CARD_WIDTH - pick(0, 8), // room for the TV focus ring
    height: CARD_WIDTH * 0.625, // 16:10, fixed pixel height
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  title: {
    color: colors.text,
    fontSize: pick(12, tvType.small),
    marginTop: pick(spacing.xs, 10),
  },
});
