import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";

// Same Supabase project as aivnetwork.online — same `films` table, same schema.
// Set these in a .env file (see .env.example) and load via expo-constants or
// EXPO_PUBLIC_ env vars (Expo inlines EXPO_PUBLIC_* at build time).
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

// SecureStore-backed storage adapter so auth sessions persist securely on-device
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Mirrors the `films` row shape used on the web app
export type Film = {
  id: string;
  title: string | null;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  creator: string | null;
  genre: string | null;
  release_year: number | null;
  year: number | null;
  views: number | null;
  trending: boolean | null;
  new_release: boolean | null;
  aiv_original: boolean | null;
};

export async function fetchFilms(): Promise<Film[]> {
  const { data, error } = await supabase
    .from("films")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Supabase load error:", error);
    return [];
  }

  return data || [];
}
