// PHASE 3 — FILMMAKER PAYOUTS (Stripe Connect)
//
// Reuses the same Stripe Connect Express account flow already built for the
// web app. Stripe's hosted onboarding works fine inside a mobile WebView —
// no need for native Stripe Connect UI, just open the account link URL.
//
// Flow:
//   1. Call your existing `/api/stripe/create-account` endpoint (same one
//      the web app uses) from here, passing the filmmaker's id/email.
//   2. Open the returned `url` in a WebView or the system browser
//      (expo-web-browser's openBrowserAsync is the simplest option).
//   3. On return, refresh the filmmaker's `stripe_onboarded` status from
//      Supabase to reflect completed onboarding.

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL as string; // e.g. https://aivnetwork.online

export async function startStripeOnboarding(filmmakerId: string, email: string): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/api/stripe/create-account`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filmmakerId, email }),
    });

    const data = await res.json();
    return data.url ?? null;
  } catch (err) {
    console.error("[stripe] onboarding request failed:", err);
    return null;
  }
}
