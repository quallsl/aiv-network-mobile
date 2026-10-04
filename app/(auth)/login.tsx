import React, { useState } from "react";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth-context";
import FocusPressable from "@/components/FocusPressable";
import { colors, radius, spacing } from "@/constants/theme";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin() {
    setError(null);
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);

    if (error) {
      setError(error);
      return;
    }

    router.replace("/(tabs)");
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>AIV Network</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textFaint}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.textFaint}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <FocusPressable
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>{submitting ? "Signing in..." : "Sign In"}</Text>
        </FocusPressable>

        <FocusPressable style={styles.textButton} onPress={() => router.push("/(auth)/signup")}>
          <Text style={styles.linkText}>Don't have an account? Sign up</Text>
        </FocusPressable>

        <FocusPressable style={styles.textButton} onPress={() => router.replace("/(tabs)")}>
          <Text style={styles.guestText}>Continue browsing as guest</Text>
        </FocusPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    width: "100%",
    maxWidth: Platform.isTV ? 640 : 480,
  },
  title: {
    color: colors.accent,
    fontSize: Platform.isTV ? 44 : 28,
    fontWeight: "800",
    marginBottom: spacing.xl,
    textAlign: "center",
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.text,
    fontSize: Platform.isTV ? 22 : 15,
    marginBottom: spacing.md,
  },
  error: {
    color: colors.accent,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: Platform.isTV ? 22 : 15,
  },
  textButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: "center",
  },
  linkText: {
    color: colors.textMuted,
    textAlign: "center",
    fontSize: Platform.isTV ? 20 : 14,
  },
  guestText: {
    color: colors.textFaint,
    textAlign: "center",
    fontSize: Platform.isTV ? 20 : 14,
  },
});