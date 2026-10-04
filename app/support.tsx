import React from "react";
import { Linking, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import FocusPressable from "@/components/FocusPressable";
import { colors, radius, spacing } from "@/constants/theme";

const SUPPORT_EMAIL = "support@aivnetwork.online";
const SUPPORT_URL = "https://aivnetwork.online/support";

function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace("/(tabs)");
}

// Apple TV has no Mail or browser, so contact details are shown as text there
function ContactRow({ label, value, url }: { label: string; value: string; url: string }) {
  if (Platform.isTV) {
    return (
      <View style={styles.row}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    );
  }
  return (
    <FocusPressable style={[styles.row, styles.rowButton]} onPress={() => Linking.openURL(url)}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, styles.link]}>{value}</Text>
    </FocusPressable>
  );
}

export default function SupportScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.column}>
        <Text style={styles.heading}>Support</Text>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>CONTACT US</Text>
          <Text style={styles.body}>
            Questions about watching films, your account, or submitting your work? We're here to
            help.
          </Text>
          <ContactRow label="Email" value={SUPPORT_EMAIL} url={`mailto:${SUPPORT_EMAIL}`} />
          <ContactRow label="Website" value={SUPPORT_URL.replace("https://", "")} url={SUPPORT_URL} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>FILMMAKERS</Text>
          <Text style={styles.body}>
            To submit a film or manage your submissions, sign in with your filmmaker account on
            AIV Network.
          </Text>
        </View>

        <FocusPressable
          style={styles.backButton}
          onPress={goBack}
          {...(Platform.isTV ? ({ hasTVPreferredFocus: true } as any) : {})}
        >
          <Text style={styles.backText}>‹ Back</Text>
        </FocusPressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: Platform.isTV ? spacing.xl : 56, alignItems: "center" },
  column: { width: "100%", maxWidth: 720 },
  heading: {
    color: colors.text,
    fontSize: Platform.isTV ? 40 : 28,
    fontWeight: "800",
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  body: {
    color: colors.text,
    fontSize: Platform.isTV ? 22 : 15,
    lineHeight: Platform.isTV ? 32 : 22,
    marginBottom: spacing.md,
  },
  row: { paddingVertical: spacing.sm },
  rowButton: { borderRadius: radius.sm },
  rowLabel: { color: colors.textMuted, fontSize: Platform.isTV ? 18 : 13, marginBottom: 2 },
  rowValue: { color: colors.text, fontSize: Platform.isTV ? 26 : 16, fontWeight: "700" },
  link: { color: colors.accent },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  backText: { color: colors.text, fontSize: Platform.isTV ? 22 : 16, fontWeight: "700" },
});