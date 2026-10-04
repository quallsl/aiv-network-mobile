import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import FocusPressable from "@/components/FocusPressable";
import { colors, spacing } from "@/constants/theme";

// Same categories as the website
export const GENRES = ["AIV Originals", "Classic Horror", "Sci-Fi", "Horror", "Comedy"];

export function matchesGenre(filmGenre: string | null | undefined, genre: string): boolean {
  if (!filmGenre) return false;
  return filmGenre
    .split(",")
    .map((g) => g.trim().toLowerCase())
    .includes(genre.toLowerCase());
}

export default function GenreRow({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (genre: string | null) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {GENRES.map((genre) => {
        const active = selected === genre;
        return (
          <FocusPressable
            key={genre}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onSelect(active ? null : genre)}
          >
            <Text style={styles.chipText}>{genre}</Text>
          </FocusPressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    justifyContent: "center",
    flexGrow: 1,
  },
  chip: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 14,
  },
});