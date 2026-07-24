import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { Film, fetchFilms } from "@/lib/supabase";
import FilmGrid from "@/components/FilmGrid";
import HeroBanner from "@/components/HeroBanner";
import TopBar from "@/components/TopBar";
import { colors } from "@/constants/theme";

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
    <View style={styles.root}>
      <TopBar films={films} search={search} onSearchChange={setSearch} />

      <ScrollView style={styles.container}>
        <HeroBanner />

        <FilmGrid title="Trending" films={trending} />
        <FilmGrid title="New Release" films={newRelease} />
        <FilmGrid title="AIV Original" films={aivOriginal} />
        <FilmGrid title="Independent" films={independent} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
});
