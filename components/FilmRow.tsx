import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Film } from "@/lib/supabase";
import FilmCard from "./FilmCard";
import { colors, spacing } from "@/constants/theme";

export default function FilmRow({ title, films }: { title: string; films: Film[] }) {
  if (films.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>{title}</Text>
      <FlatList
        data={films}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FilmCard film={item} />}
        contentContainerStyle={{ paddingHorizontal: spacing.lg }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  heading: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacing.sm,
    marginLeft: spacing.lg,
  },
});
