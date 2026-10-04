import React, { useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Film } from "@/lib/supabase";
import FocusPressable from "@/components/FocusPressable";
import { colors, radius, spacing } from "@/constants/theme";

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
      <FocusPressable style={styles.menuButton} onPress={() => setShowMenu(true)}>
        <Text style={styles.buttonText}>☰ Menu</Text>
      </FocusPressable>

      <TextInput
        style={styles.search}
        placeholder="Search films..."
        placeholderTextColor={colors.textFaint}
        value={search}
        onChangeText={onSearchChange}
      />

      <FocusPressable
        style={styles.submitButton}
        onPress={() => router.push("/(tabs)/filmmaker/submit")}
      >
        <Text style={styles.buttonText}>+ Submit</Text>
      </FocusPressable>

      <FocusPressable
        style={styles.settingsButton}
        onPress={() => router.push("/(tabs)/settings")}
      >
        <Text style={styles.buttonText}>⚙</Text>
      </FocusPressable>

      <Modal visible={showMenu} animationType="fade" transparent>
        <FocusPressable
          style={styles.overlay}
          focusedStyle={null}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuPanel}>
            <FlatList
              data={films}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <FocusPressable
                  style={styles.menuItem}
                  onPress={() => {
                    setShowMenu(false);
                    router.push(`/player/${item.id}`);
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
        </FocusPressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
  menuButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
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
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  buttonText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 12,
  },
  search: {
    flex: 1,
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    color: colors.text,
    fontSize: 13,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  menuPanel: {
    backgroundColor: colors.surface,
    marginTop: 60,
    marginHorizontal: spacing.md,
    borderRadius: radius.md,
    maxHeight: "70%",
    borderColor: colors.border,
    borderWidth: 1,
  },
  menuItem: {
    padding: spacing.md,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  menuItemText: {
    color: colors.text,
    fontSize: 14,
  },
  emptyText: {
    color: colors.textFaint,
    padding: spacing.md,
    textAlign: "center",
  },
});