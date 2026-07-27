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
import { router } from "expo-router";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { colors, radius, spacing } from "@/constants/theme";

const BUNNY_LIBRARY_ID = "697977";

function getBunnyVideoId(value: string) {
  if (!value) return null;
  const cleanValue = value.trim();

  if (/^[a-f0-9-]{36}$/i.test(cleanValue)) {
    return cleanValue;
  }

  const match = cleanValue.match(
    /player\.mediadelivery\.net\/(?:play|embed)\/(\d+)\/([a-f0-9-]+)/i
  );

  return match ? match[2] : null;
}

function getBunnyLibraryId(value: string) {
  if (!value) return BUNNY_LIBRARY_ID;

  const match = value.trim().match(
    /player\.mediadelivery\.net\/(?:play|embed)\/(\d+)\/([a-f0-9-]+)/i
  );

  return match ? match[1] : BUNNY_LIBRARY_ID;
}

function normalizeVideoUrl(value: string) {
  const cleanValue = value.trim();
  const bunnyVideoId = getBunnyVideoId(cleanValue);
  const bunnyLibraryId = getBunnyLibraryId(cleanValue);

  if (/^[a-f0-9-]{36}$/i.test(cleanValue)) {
    return `https://player.mediadelivery.net/play/${bunnyLibraryId}/${bunnyVideoId}`;
  }

  return cleanValue;
}

function getYouTubeThumbnail(url: string) {
  if (!url) return "";

  try {
    const regex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/]+)/;
    const match = url.match(regex);
    const videoId = match ? match[1] : null;

    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
  } catch {
    return "";
  }
}

function getBunnyThumbnail(value: string) {
  if (!value) return "";

  const bunnyVideoId = getBunnyVideoId(value);
  const bunnyLibraryId = getBunnyLibraryId(value);

  if (!bunnyVideoId) return "";

  return `https://vz-${bunnyLibraryId}.b-cdn.net/${bunnyVideoId}/thumbnail.jpg`;
}

export default function SubmitFilmScreen() {
  const { session } = useAuth();
  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!title.trim() || !videoUrl.trim()) {
      setError("Film title and video URL are required.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const normalizedVideoUrl = normalizeVideoUrl(videoUrl);

      const thumbnail =
        thumbnailUrl.trim() ||
        getBunnyThumbnail(videoUrl) ||
        getYouTubeThumbnail(videoUrl) ||
        "";

      const { error: insertError } = await supabase.from("films").insert([
        {
          title: title.trim(),
          creator: creator.trim(),
          description: description.trim(),
          genre: genre.trim(),
          year: year.trim(),
          thumbnail_url: thumbnail,
          video_url: normalizedVideoUrl,
        },
      ]);

      if (insertError) {
        console.error("[submit] insert error:", insertError);
        setError(insertError.message);
        setUploading(false);
        return;
      }

      setUploading(false);
      router.push("/(tabs)/filmmaker");
    } catch (err) {
      console.error("[submit] submission error:", err);
      setError("Something went wrong. Please try again.");
      setUploading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Film Title *</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholderTextColor={colors.textFaint} />

      <Text style={styles.label}>Creator / Director</Text>
      <TextInput style={styles.input} value={creator} onChangeText={setCreator} placeholderTextColor={colors.textFaint} />

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

      <Text style={styles.label}>Release Year</Text>
      <TextInput style={styles.input} value={year} onChangeText={setYear} placeholderTextColor={colors.textFaint} keyboardType="number-pad" />

      <Text style={styles.label}>Video URL *</Text>
      <TextInput
        style={styles.input}
        value={videoUrl}
        onChangeText={setVideoUrl}
        placeholder="Bunny Video ID or Video URL (Bunny.net, YouTube, Vimeo)"
        placeholderTextColor={colors.textFaint}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Thumbnail URL</Text>
      <TextInput
        style={styles.input}
        value={thumbnailUrl}
        onChangeText={setThumbnailUrl}
        placeholder="Optional — Bunny/YouTube can auto-generate"
        placeholderTextColor={colors.textFaint}
        autoCapitalize="none"
      />

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