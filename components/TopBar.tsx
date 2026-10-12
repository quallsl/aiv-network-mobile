import React, { useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Film } from "@/lib/supabase";
import { colors, radius, spacing } from "@/constants/theme";
import { IS_TV, pick, tvSafe, tvType } from "@/constants/tv";
import FocusPressable from "@/components/FocusPressable";

export default function TopBar({
  films,
  search,
  onSearchChange,
}: {
  films: Film[];
  search: string;
  onSearchChange: (text: string) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  function openFilm(id: string) {
    setShowMenu(false);
    router.push(`/player/${id}`);
  }

  return (
    <View style={styles.bar}>
      <FocusPressable style={styles.accentButton} onPress={() => setShowMenu(true)}>
        <Text style={styles.buttonText}>☰ Menu</Text>
      </FocusPressable>

      <TextInput
        style={styles.search}
        placeholder="Search films..."
        placeholderTextColor={colors.textFaint}
        value={search}
        onChangeText={onSearchChange}
      />

      {/* Uploading and the gear icon are phone-only. On Apple TV,
          Settings is a top tab and uploads aren't possible. */}
      {!IS_TV && (
        <FocusPressable
          style={styles.accentButton}
          onPress={() => router.push("/(tabs)/filmmaker/submit")}
        >
          <Text style={styles.buttonText}>+ Submit</Text>
        </FocusPressable>
      )}

      {!IS_TV && (
        <FocusPressable
          style={styles.outlineButton}
          onPress={() => router.push("/(tabs)/settings")}
        >
          <Text style={styles.buttonText}>⚙</Text>
        </FocusPressable>
      )}

      <Modal
        visible={showMenu}
        animationType="fade"
        transparent
        onRequestClose={() => setShowMenu(false)} // Siri Remote Back/Menu button
      >
        {/* Plain View overlay (not a Pressable) so the TV focus engine
            can reach the film list instead of trapping focus on the overlay. */}
        <View style={styles.overlay}>
          <View style={styles.menuPanel}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>All Films</Text>
              <FocusPressable
                style={styles.outlineButton}
                onPress={() => setShowMenu(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </FocusPressable>
            </View>

            <FlatList
              data={films}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <FocusPressable
                  style={styles.menuItem}
                  onPress={() => openFilm(item.id)}
                  hasTVPreferredFocus={IS_TV && index === 0}
                  focusStyle={styles.menuItemFocused}
                >
                  <Text style={styles.menuItemText} numberOfLines={1}>
                    {item.title || "Untitled Film"}
                  </Text>
                </FocusPressable>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>No films yet.</Text>}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const control = {
  minHeight: pick(36, tvType.controlHeight),
  borderRadius: pick(radius.sm, 12),
  paddingVertical: pick(spacing.sm, 16),
  paddingHorizontal: pick(spacing.sm, 36),
  justifyContent: "center" as const,
  alignItems: "center" as const,
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: pick(spacing.xs, 32),
    paddingHorizontal: pick(spacing.sm, tvSafe.horizontal),
    paddingVertical: pick(spacing.sm, 24),
    backgroundColor: pick(colors.surface, colors.background),
  },
  accentButton: {
    ...control,
    backgroundColor: colors.accent,
  },
  outlineButton: {
    ...control,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
  },
  buttonText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: pick(12, tvType.body),
  },
  search: {
    flex: 1,
    minHeight: pick(32, tvType.controlHeight),
    backgroundColor: pick(colors.background, colors.surface),
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: pick(radius.sm, 12),
    paddingHorizontal: pick(spacing.sm, 28),
    paddingVertical: pick(spacing.xs, 12),
    color: colors.text,
    fontSize: pick(13, tvType.body),
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: pick("flex-start" as const, "center" as const),
    alignItems: pick("stretch" as const, "center" as const),
  },
  menuPanel: {
    backgroundColor: colors.surface,
    marginTop: pick(60, 0),
    marginHorizontal: pick(spacing.md, 0),
    width: pick(undefined, 1000),
    borderRadius: pick(radius.md, 16),
    maxHeight: pick("70%" as const, "80%" as const),
    borderColor: colors.border,
    borderWidth: 1,
    padding: pick(0, 40),
  },
  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: pick(spacing.md, 0),
    marginBottom: pick(0, 24),
  },
  menuTitle: {
    color: colors.text,
    fontSize: pick(16, tvType.title),
    fontWeight: "700",
  },
  menuItem: {
    minHeight: pick(44, tvType.controlHeight),
    justifyContent: "center",
    padding: pick(spacing.md, 20),
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    borderRadius: pick(0, 12),
  },
  menuItemFocused: {
    backgroundColor: colors.surfaceRaised,
    transform: [{ scale: 1.03 }],
  },
  menuItemText: {
    color: colors.text,
    fontSize: pick(14, tvType.body),
  },
  emptyText: {
    color: colors.textFaint,
    padding: pick(spacing.md, 24),
    textAlign: "center",
    fontSize: pick(14, tvType.body),
  },
});