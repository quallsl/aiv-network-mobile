import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Video, { VideoRef } from "react-native-video";
import { useFocusEffect } from "expo-router";
import { getBunnyStreamUrl } from "@/lib/bunny";
import { requestPreRollAd } from "@/lib/ads";
import { colors } from "@/constants/theme";
import { pick, tvType } from "@/constants/tv";

// Same AIV promo video used on the web hero (app/page.js)
const HERO_EMBED_URL =
  "https://player.mediadelivery.net/embed/697977/264c75e3-cf23-4154-a081-98883ca50742";

export default function HeroBanner() {
  const videoRef = useRef<VideoRef>(null);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(true); // stays paused until ad resolves
  const [userPaused, setUserPaused] = useState(false);
  // Only a real trip to the background pauses the promo. At launch, Apple TV can
  // report "unknown"/"inactive" and never send a change event, which used to
  // leave the hero paused forever.
  const [appActive, setAppActive] = useState(AppState.currentState !== "background");
  const adRequestedRef = useRef(false);

  // Apple TV: a fresh player each time Home comes back, so the promo always
  // restarts reliably after a film or after leaving the app (phones unchanged).
  const [playerKey, setPlayerKey] = useState(0);
  const leftHomeRef = useRef(false);
  function restartOnTV() {
    if (!Platform.isTV) return;
    setLoading(true);
    setPlayerKey((k) => k + 1);
  }

  // Pause when another screen (film details / player) is pushed on top of Home
  const [isFocused, setIsFocused] = useState(true);
  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      if (leftHomeRef.current) {
        leftHomeRef.current = false;
        restartOnTV();
      }
      return () => {
        setIsFocused(false);
        leftHomeRef.current = true;
      };
    }, [])
  );

  // Pause when the app is backgrounded (Siri Remote Home/TV button)
  useEffect(() => {
    let wasBackground = false;
    const sub = AppState.addEventListener("change", (state) => {
      setAppActive(state !== "background");
      if (state === "background") wasBackground = true;
      if (state === "active" && wasBackground) {
        wasBackground = false;
        restartOnTV();
      }
    });
    return () => sub.remove();
  }, []);

  const { width, height: screenHeight } = useWindowDimensions();
  // Phones: fixed 220. Apple TV: full 16:9 promo, capped at ~60% of the screen so the grid stays visible.
  const heroHeight = Platform.isTV
    ? Math.round(Math.min((width * 9) / 16, screenHeight * 0.6))
    : 220;

    // iPad can silently drop an ad shown during launch. Wait until the app is
  // fully active and settled before requesting the hero's pre-roll.
  async function waitUntilSettled() {
    if (AppState.currentState !== "active") {
      await new Promise<void>((resolve) => {
        const sub = AppState.addEventListener("change", (s) => {
          if (s === "active") {
            sub.remove();
            resolve();
          }
        });
      });
    }
    await new Promise((r) => setTimeout(r, 1500));
  }

  async function handleLoad() {
    setLoading(false);

    if (!adRequestedRef.current) {
      adRequestedRef.current = true;
      await waitUntilSettled();
      await requestPreRollAd("hero-promo");
      setPaused(false);
    } else {
      setPaused(false);
    }
  }

  function togglePause() {
    setUserPaused((prev) => !prev);
  }

  const shouldPause = paused || userPaused || !isFocused || !appActive;

  return (
    <Pressable
      style={[styles.wrapper, { height: heroHeight }]}
      onPress={togglePause}
    >
      {loading && (
        <ActivityIndicator
          style={StyleSheet.absoluteFill}
          color={colors.accent}
          size="large"
        />
      )}
      <Video
        key={playerKey}
        ref={videoRef}
        source={{ uri: getBunnyStreamUrl(HERO_EMBED_URL) }}
        style={styles.video}
        resizeMode={Platform.isTV ? "contain" : "cover"}
        muted={!isFocused}
        repeat
        playInBackground={false}
        controls={false}
        paused={shouldPause}
        onLoad={handleLoad}
        // Backup for "repeat": if the promo reaches the end on Apple TV, loop it manually
        onEnd={() => {
          if (Platform.isTV) videoRef.current?.seek(0);
        }}
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

const ICON = pick(36, 80);

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
    bottom: pick(12, 60), // inside the TV safe area
    right: pick(12, 80),
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: pick(20, 40),
    width: ICON,
    height: ICON,
    justifyContent: "center",
    alignItems: "center",
  },
  playPauseText: {
    color: "#fff",
    fontSize: pick(14, tvType.body),
  },
});
