import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Video from "react-native-video";
import { getBunnyStreamUrl } from "@/lib/bunny";
import { requestPreRollAd } from "@/lib/ads";
import { colors } from "@/constants/theme";

// Same AIV promo video used on the web hero (app/page.js)
const HERO_EMBED_URL =
  "https://player.mediadelivery.net/embed/697977/264c75e3-cf23-4154-a081-98883ca50742";

export default function HeroBanner() {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(true); // stays paused until ad resolves
  const [userPaused, setUserPaused] = useState(false);
  const adRequestedRef = useRef(false);

  const { width, height: screenHeight } = useWindowDimensions();
  // Phones: fixed 220. Apple TV: full 16:9 promo, capped at ~60% of the screen so the grid stays visible.
  const heroHeight = Platform.isTV
    ? Math.round(Math.min((width * 9) / 16, screenHeight * 0.6))
    : 220;

  async function handleLoad() {
    setLoading(false);

    if (!adRequestedRef.current) {
      adRequestedRef.current = true;
      await requestPreRollAd("hero-promo");
      setPaused(false);
    } else {
      setPaused(false);
    }
  }

  function togglePause() {
    setUserPaused((prev) => !prev);
  }

  return (
    <Pressable style={[styles.wrapper, { height: heroHeight }]} onPress={togglePause}>
      {loading && (
        <ActivityIndicator
          style={StyleSheet.absoluteFill}
          color={colors.accent}
          size="large"
        />
      )}
      <Video
        ref={videoRef}
        source={{ uri: getBunnyStreamUrl(HERO_EMBED_URL) }}
        style={styles.video}
        resizeMode={Platform.isTV ? "contain" : "cover"}
        muted={false}
        repeat
        playInBackground={false}
        controls={false}
        paused={paused || userPaused}
        onLoad={handleLoad}
        onError={(e) => console.error("[hero] playback error:", e)}
      />

      {!loading && (
        <View style={styles.playPauseIcon}>
          <Text style={styles.playPauseText}>{userPaused ? "▶" : "❚❚"}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    backgroundColor: colors.background,
    marginBottom: 8,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  playPauseIcon: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  playPauseText: {
    color: "#fff",
    fontSize: 14,
  },
});