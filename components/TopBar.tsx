import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { Film } from "@/lib/supabase";
import FocusPressable from "@/components/FocusPressable";
import { colors, radius, spacing } from "@/constants/theme";
import { IS_TV, pick, tvSafe, tvType } from "@/constants/tv";

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

  return (
    <View style={styles.bar}>
      <FocusPressable
        style={styles.menuButton}
        onPress={() => setShowMenu(true)}
      >
        <Text style={styles.buttonText}>☰ Menu</Text>
      </FocusPressable>

      <TextInput
        style={styles.search}
        placeholder="Search films..."
        placeholderTextColor={colors.textFaint}
        value={search}
        onChangeText={onSearchChange}
      />

      {/* Uploading films isn't possible on Apple TV */}
      {!IS_TV && (
        <FocusPressable
          style={styles.submitButton}
          onPress={() => router.push("/(tabs)/filmmaker/submit")}
        >
          <Text style={styles.buttonText}>+ Submit</Text>
        </FocusPressable>
      )}

      <FocusPressable
        style={styles.settingsButton}
        onPress={() => router.push("/support")}
      >
        <Text style={styles.buttonText}>Support</Text>
      </FocusPressable>

      <Modal
        visible={showMenu}
        animationType="fade"
        transparent
        onRequestClose={() => setShowMenu(false)} // Siri Remote Back closes it
      >
        {/* Phones: tap outside to close (unchanged). Apple TV: the overlay is
            not focusable, so focus goes straight to the film list, and a
            Close button is shown instead. */}
        <Pressable
          style={styles.overlay}
          onPress={() => setShowMenu(false)}
          disabled={IS_TV}
          focusable={!IS_TV}
        >
          <View style={styles.menuPanel}>
            {IS_TV && (
              <View style={styles.menuHeader}>
                <Text style={styles.menuTitle}>All Films</Text>
                <FocusPressable
                  style={styles.closeButton}
                  onPress={() => setShowMenu(false)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </FocusPressable>
              </View>
            )}
            <FlatList
              data={films}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <FocusPressable
                  style={styles.menuItem}
                  hasTVPreferredFocus={IS_TV && index === 0}
                  onPress={() => {
                    setShowMenu(false);
                    router.push(`/film/${item.id}`);
                  }}
                >
                  <Text style={styles.menuItemText} numberOfLines={1}>
                    {item.title || "Untitled Film"}
                  </Text>
                </FocusPressable>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No films yet.</Text>
              }
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

// Phone values unchanged; Apple TV gets 10-foot sizes
const tvControl = IS_TV
  ? {
      minHeight: tvType.controlHeight,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    }
  : {};

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: pick(spacing.xs, 28),
    paddingHorizontal: pick(spacing.sm, tvSafe.horizontal),
    paddingVertical: pick(spacing.sm, 24),
    backgroundColor: colors.surface,
  },
  menuButton: {
    backgroundColor: colors.accent,
    borderRadius: pick(radius.sm, 12),
    paddingVertical: pick(spacing.sm, 16),
    paddingHorizontal: pick(spacing.sm, 36),
    ...tvControl,
  },
  submitButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  settingsButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: pick(radius.sm, 12),
    paddingVertical: pick(spacing.sm, 16),
    paddingHorizontal: pick(spacing.sm, 36),
    ...tvControl,
  },
  closeButton: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 36,
    ...tvControl,
  },
  buttonText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: pick(12, tvType.body),
  },
  search: {
    flex: 1,
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: pick(radius.sm, 12),
    paddingHorizontal: pick(spacing.sm, 28),
    paddingVertical: pick(spacing.xs, 16),
    color: colors.text,
    fontSize: pick(13, tvType.body),
    ...(IS_TV ? { minHeight: tvType.controlHeight } : {}),
  },
  overlay: {
    flex: 1,
    backgroundColor: pick("rgba(0,0,0,0.6)", "rgba(0,0,0,0.8)"),
    ...(IS_TV
      ? { justifyContent: "center" as const, alignItems: "center" as const }
      : {}),
  },
  menuPanel: {
    backgroundColor: colors.surface,
    marginTop: pick(60, 0),
    marginHorizontal: pick(spacing.md, 0),
    borderRadius: pick(radius.md, 16),
    maxHeight: pick("70%" as const, "80%" as const),
    borderColor: colors.border,
    borderWidth: 1,
    ...(IS_TV ? { width: 1000, padding: 40 } : {}),
  },
  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  menuTitle: {
    color: colors.text,
    fontSize: tvType.title,
    fontWeight: "700",
  },
  menuItem: {
    padding: pick(spacing.md, 20),
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    ...(IS_TV
      ? {
          minHeight: tvType.controlHeight,
          justifyContent: "center" as const,
          borderRadius: 12,
        }
      : {}),
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
