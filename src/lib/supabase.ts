import { Platform } from "react-native";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// AsyncStorage is only available on native/client — use a no-op store for SSR
let storage: any = undefined;
if (Platform.OS !== "web" || typeof window !== "undefined") {
  // Safe to import AsyncStorage on native or in the browser
  storage = require("@react-native-async-storage/async-storage").default;
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: Platform.OS !== "web" || typeof window !== "undefined",
    detectSessionInUrl: false,
  },
});
