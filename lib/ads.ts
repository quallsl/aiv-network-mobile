import { Platform } from "react-native";

// Same fallback VAST tag used in web's AVODPlayer.js, for dev/testing
const TEST_VAST_TAG =
  "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&cust_params=sample_ct%3Dlinear&gdfp_req=1&output=vast&env=vp&unviewed_position_start=1&impl=s&correlator=";

const IOS_AD_UNIT_ID = "ca-app-pub-4013153499723354/7307087444";
const LOAD_TIMEOUT_MS = 8000;

type AdsModule = typeof import("react-native-google-mobile-ads");

// AdMob has no tvOS SDK. Load it only on phones/tablets so Apple TV never touches it.
function loadAds(): AdsModule | null {
  if (Platform.isTV) return null;
  return require("react-native-google-mobile-ads") as AdsModule;
}

function getInterstitialAdUnitId(ads: AdsModule): string {
  if (__DEV__) return ads.TestIds.INTERSTITIAL;
  // Android has no real ad unit yet — test ID until one exists.
  if (Platform.OS === "ios") return IOS_AD_UNIT_ID;
  return ads.TestIds.INTERSTITIAL;
}

export function getAdTagUrl(): string {
  return process.env.EXPO_PUBLIC_VAST_TAG || `${TEST_VAST_TAG}${Date.now()}`;
}

/**
 * Shows a pre-roll interstitial. Resolves only when the ad is CLOSED,
 * errors, or fails to LOAD within the timeout. Once the ad is on screen,
 * the timeout no longer applies — content waits for the viewer to close it.
 */
export async function requestPreRollAd(videoId: string): Promise<void> {
  const ads = loadAds();
  if (!ads) return;

  const { AdEventType, InterstitialAd } = ads;

  return new Promise((resolve) => {
    const interstitial = InterstitialAd.createForAdRequest(
      getInterstitialAdUnitId(ads),
      { requestNonPersonalizedAdsOnly: false },
    );

    let settled = false;
    let shown = false;

    const unsubs: Array<() => void> = [];
    function cleanup() {
      unsubs.forEach((u) => u());
      unsubs.length = 0;
      clearTimeout(timer);
    }
    function finish() {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    }

    // Only guards the LOADING phase. If it fires, listeners are removed,
    // so a late-loading ad can never pop up over the film.
    const timer = setTimeout(() => {
      if (!shown) {
        console.warn(`[ads] Pre-roll load timed out for video ${videoId}`);
        finish();
      }
    }, LOAD_TIMEOUT_MS);

    unsubs.push(
      interstitial.addAdEventListener(AdEventType.LOADED, () => {
        if (settled) return;
        shown = true;
        clearTimeout(timer);
        interstitial.show().catch((err: unknown) => {
          console.warn(`[ads] Pre-roll show failed for video ${videoId}:`, err);
          finish();
        });
      }),
    );

    unsubs.push(
      interstitial.addAdEventListener(AdEventType.CLOSED, () => finish()),
    );

    unsubs.push(
      interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
        console.warn(`[ads] Pre-roll ad failed for video ${videoId}:`, error);
        finish();
      }),
    );

    interstitial.load();
  });
}