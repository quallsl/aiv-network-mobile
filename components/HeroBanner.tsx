import React, { useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Video from "react-native-video";
import { getBunnyStreamUrl } from "@/lib/bunny";
import { requestPreRollAd } from "@/lib/ads";
import { colors } from "@/constants/theme";
import { pick, tvSafe, tvType } from "@/constants/tv";
import FocusPressable from "@/components/FocusPressable";

// Same AIV promo video used on the web hero (app/page.js)
const HERO_EMBED_URL =
  "https://player.mediadelivery.net/embed/697977/264c75e3-cf23-4154-a081-98883ca50742";

export default function HeroBanner() {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(true); // stays paused until ad resolves
  const [userPaused, setUserPaused] = useState(false);
  const adRequestedRef = useRef(false);

  async function handleLoad() {
    setLoading(false);

    if (!adRequestedRef.current) {
      adRequestedRef.current = true;
      await requestPreRollAd("hero-promo");
    }
    setPaused(false);
  }

  return (
    <View style={styles.outer}>
      <FocusPressable
        style={styles.wrapper}
        onPress={() => setUserPaused((prev) => !prev)}
        hasTVPreferredFocus
      >
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
          resizeMode="cover"
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
      </FocusPressable>
    </View>
  );
}

const ICON = pick(36, 88);

const styles = StyleSheet.create({
  // On TV the hero sits inside the overscan-safe margins
  outer: {
    paddingHorizontal: pick(0, tvSafe.horizontal),
    marginBottom: pick(8, 48),
  },
  wrapper: {
    width: "100%",
    height: pick(220, 560),
    backgroundColor: colors.background,
    borderRadius: pick(0, 16),
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  playPauseIcon: {
    position: "absolute",
    bottom: pick(12, 32),
    right: pick(12, 32),
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: ICON / 2,
    width: ICON,
    height: ICON,
    justifyContent: "center",
    alignItems: "center",
  },
  playPauseText: {
    color: "#fff",
    fontSize: pick(14, tvType.title),
  },
});