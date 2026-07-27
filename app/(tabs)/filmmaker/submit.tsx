import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth-context";
import { colors, radius, spacing } from "@/constants/theme";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL as string;

export default function SubmitFilmScreen() {
  const { session } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [creator, setCreator] = useState("");
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pickVideo() {
    const result = await DocumentPicker.getDocumentAsync({
      type: "video/*",
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets?.[0]) {
      setFile(result.assets[0]);
    }
  }

  async function handleSubmit() {
    if (!file || !title.trim()) {
      setError("A video file and title are required.");
      return;
    }

    if (!session?.user?.email) {
      setError("You must be signed in to submit a film.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();

      console.log("[submit] file object:", JSON.stringify(file));

      formData.append("video", {
        uri: file.uri,
        name: file.name ?? `upload-${Date.now()}.mp4`,
        type: file.mimeType ?? "video/mp4",
      });

      formData.append("title", title);
      formData.append("description", description);
      formData.append("genre", genre);
      formData.append("creator", creator);
      formData.append("email", session.user.email);
      formData.append("userId", session.user.id);

      const res = await fetch(`${API_BASE}/api/films/upload`, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed.");
        setUploading(false);
        return;
      }

      setUploading(false);
      router.push("/(tabs)/filmmaker");
    } catch (err) {
      console.error("[submit] upload error:", err);
      setError("Something went wrong. Please try again.");
      setUploading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Video File</Text>
      <Pressable style={styles.filePicker} onPress={pickVideo}>
        <Text style={styles.filePickerText}>
          {file ? file.name : "Choose a video file"}
        </Text>
      </Pressable>

      <Text style={styles.label}>Title *</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholderTextColor={colors.textFaint} />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={description}
        onChangeText={setDescription}
        multiline
        placeholderTextColor={colors.textFaint}
      />

      <Text style={styles.label}>Genre</Text>
      <TextInput style={styles.input} value={genre} onChangeText={setGenre} placeholderTextColor={colors.textFaint} />

      <Text style={styles.label}>Creator Name</Text>
      <TextInput style={styles.input} value={creator} onChangeText={setCreator} placeholderTextColor={colors.textFaint} />

      <Text style={styles.emailNote}>
        Submitting as {session?.user?.email || "unknown"}
      </Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable
        style={[styles.submitButton, uploading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <Text style={styles.submitButtonText}>Submit Film</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  label: { color: colors.text, fontSize: 13, fontWeight: "700", marginTop: spacing.md, marginBottom: spacing.xs },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.text,
  },
  multiline: { minHeight: 80, textAlignVertical: "top" },
  filePicker: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  filePickerText: { color: colors.textMuted },
  emailNote: { color: colors.textFaint, fontSize: 12, marginTop: spacing.md },
  error: { color: colors.accent, marginTop: spacing.md },
  submitButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { color: colors.text, fontWeight: "700" },
});