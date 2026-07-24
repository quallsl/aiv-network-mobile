# AIV Network — Mobile App

React Native + Expo Router companion app for aivnetwork.online. Reuses the same
Supabase project, Bunny Stream library, and (eventually) Stripe Connect flow as
the web app.

## Structure

```
app/
  _layout.tsx              Root layout — wraps everything in AuthProvider
  (auth)/
    login.tsx               Sign in (guests can skip and browse anyway)
    signup.tsx
  (tabs)/
    _layout.tsx              Bottom tab navigator
    index.tsx                Home — Trending / New Release / AIV Original / Independent
    search.tsx                Placeholder for full search/browse (Phase 1.5)
    profile.tsx               Account + sign out
    filmmaker/
      _layout.tsx             Auth-gated — redirects to login if signed out
      index.tsx                Dashboard
      submit.tsx                Upload flow (Phase 3 — not yet built)
      payouts.tsx                Stripe Connect onboarding (Phase 3 — hook wired, needs API)
  player/
    [id].tsx                  Fullscreen player, outside the tab bar

components/
  FilmCard.tsx                Single thumbnail
  FilmRow.tsx                 Horizontal scrolling category row
  VideoPlayer.tsx             react-native-video wrapper with Phase 2 ad hook

lib/
  supabase.ts                 Client + Film type + fetchFilms()
  bunny.ts                    Ported from web's page.js — same hostname/parsing logic
  auth-context.tsx             Supabase auth state, session persistence via SecureStore
  ads.ts                       PHASE 2 — currently a no-op, see comments for AdMob/IMA plan
  stripe.ts                    PHASE 3 — calls your existing web API's Stripe Connect route

constants/
  theme.ts                    Colors/spacing matching the web app's black/red branding
```

## Setup

```bash
npm install
cp .env.example .env   # fill in your Supabase URL/anon key
npx expo start
```

Scan the QR code with Expo Go for quick testing of Phase 1 (browsing + playback).
**Note:** once you add `react-native-google-mobile-ads` for Phase 2, you'll need
to switch to a custom dev client (`npx expo prebuild` + a real device/simulator
build) since Expo Go doesn't support native ad SDK modules.

## What's real vs. placeholder right now

**Working (Phase 1):**
- Supabase-backed film catalog, same `films` table as web
- Four category rows (Trending / New Release / AIV Original / Independent)
- HLS playback via `react-native-video`, pointed at the same Bunny CDN hostname
- Working auth (sign up / sign in / sign out / guest browsing)
- Chromecast plugin installed and configured (casting UI not yet built into the player — add a `CastButton` from `react-native-google-cast` into `VideoPlayer.tsx` when ready)

**Wired but not implemented (Phase 2 — ads):**
- `lib/ads.ts` — `requestPreRollAd()` is called on every video load, currently just logs. Swap in native AdMob/IMA here.

**Wired but not implemented (Phase 3 — filmmaker tools):**
- `lib/stripe.ts` — calls your existing web app's `/api/stripe/create-account` route, opens the onboarding URL in-browser
- `submit.tsx` — screen exists, upload logic (Bunny direct upload) still needs building

## Next steps, in order

1. Fill in `.env`, run `npx expo start`, confirm films load and play (Phase 1 done)
2. Build out `submit.tsx`'s actual upload flow
3. Wire real filmmaker stats into the dashboard
4. Add `react-native-google-mobile-ads`, build a dev client, implement `requestPreRollAd()`
