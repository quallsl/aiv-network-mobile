import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Film, fetchFilms } from "@/lib/supabase";
import FilmRow from "@/components/FilmRow";
import { colors, radius, spacing } from "@/constants/theme";

export default function HomeScreen() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchFilms().then((data) => {
      setFilms(data);
      setLoading(false);
    });
  }, []);

  const filtered = films.filter((film) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    return (
      film.title?.toLowerCase().includes(query) ||
      film.creator?.toLowerCase().includes(query) ||
      film.genre?.toLowerCase().includes(query)
    );
  });

  // Same four fixed categories as the web app
  const trending = filtered.filter((f) => f.trending);
  const newRelease = filtered.filter((f) => f.new_release);
  const aivOriginal = filtered.filter((f) => f.aiv_original);
  const independent = filtered.filter((f) => !f.aiv_original);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search films..."
        placeholderTextColor={colors.textFaint}
        value={search}
        onChangeText={setSearch}
      />

      <FilmRow title="Trending" films={trending} />
      <FilmRow title="New Release" films={newRelease} />
      <FilmRow title="AIV Original" films={aivOriginal} />
      <FilmRow title="Independent" films={independent} />
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
  search: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.text,
    margin: spacing.lg,
  },
});
