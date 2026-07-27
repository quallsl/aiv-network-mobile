import { Platform } from "react-native";
import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";

// Same fallback VAST tag used in web's AVODPlayer.js, for dev/testing
const TEST_VAST_TAG =
  "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&cust_params=sample_ct%3Dlinear&gdfp_req=1&output=vast&env=vp&unviewed_position_start=1&impl=s&correlator=";

const IOS_AD_UNIT_ID = "ca-app-pub-4013153499723354/7307087444";

function getInterstitialAdUnitId(): string {
  if (__DEV__) return TestIds.INTERSTITIAL;

  // Android doesn't have a real ad unit yet — fall back to test ID
  // even in production until a real Android AdMob app/ad unit exists.
  if (Platform.OS === "ios") return IOS_AD_UNIT_ID;

  return TestIds.INTERSTITIAL;
}

function getAdTagUrl(): string {
  return (
    process.env.EXPO_PUBLIC_VAST_TAG ||
    `${TEST_VAST_TAG}${Date.now()}`
  );
}

/**
 * Requests and shows a pre-roll ad, mirroring the pause/resume pattern from
 * web's startAds(). Resolves once the ad is dismissed, fails to load, or
 * errors out — the caller (VideoPlayer.tsx) should resume content playback
 * either way.
 */
export async function requestPreRollAd(videoId: string): Promise<void> {
  return new Promise((resolve) => {
    const adUnitId = getInterstitialAdUnitId();

    const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: false,
    });

    let settled = false;

    function finish() {
      if (settled) return;
      settled = true;
      resolve();
    }

    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        interstitial.show();
      }
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        unsubscribeLoaded();
        unsubscribeClosed();
        unsubscribeError();
        finish();
      }
    );

    const unsubscribeError = interstitial.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.warn(`[ads] Pre-roll ad failed for video ${videoId}:`, error);
        unsubscribeLoaded();
        unsubscribeClosed();
        unsubscribeError();
        finish();
      }
    );

    interstitial.load();

    // Safety timeout: never block content playback more than 8s
    setTimeout(finish, 8000);
  });
}