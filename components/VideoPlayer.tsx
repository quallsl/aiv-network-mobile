import React, { useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Video from "react-native-video";
import { requestPreRollAd } from "@/lib/ads";
import { colors } from "@/constants/theme";

export default function VideoPlayer({
  streamUrl,
  filmId,
}: {
  streamUrl: string;
  filmId: string;
}) {
  const videoRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const adRequestedRef = useRef(false);

  async function handleLoad() {
    setLoading(false);

    if (!adRequestedRef.current) {
      adRequestedRef.current = true;
      setPaused(true); // CONTENT_PAUSE_REQUESTED equivalent
      await requestPreRollAd(filmId);
      setPaused(false); // CONTENT_RESUME_REQUESTED equivalent
    }
  }

  return (
    <View style={styles.wrapper}>
      {loading && (
        <ActivityIndicator style={StyleSheet.absoluteFill} color={colors.accent} size="large" />
      )}
      <Video
        ref={videoRef}
        source={{ uri: streamUrl }}
        style={styles.video}
        controls
        paused={paused}
        resizeMode="contain"
        onLoad={handleLoad}
        onError={(e) => console.error("[player] playback error:", e)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: colors.background,
    justifyContent: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});