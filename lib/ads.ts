// PHASE 2 — IN-APP VIDEO ADS
//
// Web uses Google IMA (JS SDK) directly in AVODPlayer.js. Mobile needs the
// native IMA SDK instead, since AdMob/IMA on iOS + Android requires native
// modules — there's no JS-only equivalent.
//
// Recommended path when you're ready to build this out:
//   1. Create a Google AdMob account (separate from AdSense) and an app-ads.txt
//      entry for both the iOS and Android app listings.
//   2. Add `react-native-google-mobile-ads` (community-maintained, wraps the
//      native AdMob + IMA SDKs) — this requires an Expo "dev client" build,
//      not the default Expo Go app, since it links native code.
//   3. Wire a pre-roll ad request into VideoPlayer.tsx's onLoad/onReady event,
//      mirroring the `startAds()` pattern already used in web's AVODPlayer.js.
//
// This file is the single place mobile ad logic should live, so
// VideoPlayer.tsx only ever calls `requestPreRollAd()` — swapping ad
// providers later never touches the player component itself.

export async function requestPreRollAd(videoId: string): Promise<void> {
  // TODO(Phase 2): call native IMA ad request here.
  console.log(`[ads] Pre-roll ad requested for video ${videoId} (not yet implemented)`);
}
