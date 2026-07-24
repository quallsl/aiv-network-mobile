import React, { useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Video from "react-native-video";
import { getBunnyStreamUrl } from "@/lib/bunny";
import { colors } from "@/constants/theme";

// Same AIV promo video used on the web hero (app/page.js)
const HERO_EMBED_URL =
  "https://player.mediadelivery.net/embed/697977/264c75e3-cf23-4154-a081-98883ca50742";

export default function HeroBanner() {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.wrapper}>
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
        paused={false}
        onLoad={() => setLoading(false)}
        onError={(e) => console.error("[hero] playback error:", e)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: 220,
    backgroundColor: colors.background,
    marginBottom: 8,
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
