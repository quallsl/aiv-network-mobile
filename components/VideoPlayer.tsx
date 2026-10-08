import React, { useEffect, useRef, useState } from "react";
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
  const [adDone, setAdDone] = useState(false);
  const [loading, setLoading] = useState(true);

  // Run the pre-roll BEFORE the film mounts, so the two can never overlap.
  useEffect(() => {
    let cancelled = false;
    setAdDone(false);
    setLoading(true);
    requestPreRollAd(filmId).finally(() => {
      if (!cancelled) setAdDone(true);
    });
    return () => {
      cancelled = true;
    };
  }, [filmId]);

  return (
    <View style={styles.wrapper}>
      {(!adDone || loading) && (
        <ActivityIndicator
          style={StyleSheet.absoluteFill}
          color={colors.accent}
          size="large"
        />
      )}
      {adDone && (
        <Video
          ref={videoRef}
          source={{ uri: streamUrl }}
          style={styles.video}
          controls
          paused={false}
          resizeMode="contain"
          onLoad={() => setLoading(false)}
          onError={(e) => console.error("[player] playback error:", e)}
        />
      )}
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