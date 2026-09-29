import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const isClient = typeof window !== "undefined";

// Custom storage adapter that lazily loads AsyncStorage only on the client
const clientStorage = isClient
  ? {
      getItem: (key: string) =>
        require("@react-native-async-storage/async-storage").default.getItem(key),
      setItem: (key: string, value: string) =>
        require("@react-native-async-storage/async-storage").default.setItem(key, value),
      removeItem: (key: string) =>
        require("@react-native-async-storage/async-storage").default.removeItem(key),
    }
  : undefined;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: clientStorage,
    autoRefreshToken: isClient,
    persistSession: isClient,
    detectSessionInUrl: false,
  },
});
