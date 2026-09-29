import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlassCard } from "@/components/ui/glass-card";
import { GradientBackground } from "@/components/ui/gradient-background";
import { Palette, type AppPalette } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { useAppTheme } from "@/context/theme-context";

export default function LoginScreen() {
  const router = useRouter();
  const { palette } = useAppTheme();
  const { login } = useAuth();
  const styles = React.useMemo(() => getStyles(palette), [palette]);

  function handleLogin() {
    login();
    router.replace("/");
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={20} color={palette.textSecondary} />
          </Pressable>

          <Animated.View entering={FadeIn.duration(500)}>
            <Text style={styles.title}>Log In</Text>
            <Text style={styles.subtitle}>Login form coming next — this is a placeholder route.</Text>

            <GlassCard style={styles.card}>
              <Text style={styles.cardText}>Build the email/password form here.</Text>
            </GlassCard>

            <Pressable style={styles.submitBtn} onPress={handleLogin}>
              <Text style={styles.submitBtnText}>Log In (placeholder)</Text>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const getStyles = (themePalette: AppPalette) =>
  StyleSheet.create({
    safeArea: { flex: 1 },
    content: { flex: 1, paddingHorizontal: 24, paddingTop: 8 },
    backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center", marginBottom: 16 },
    title: { fontSize: 26, fontWeight: "800", color: themePalette.textPrimary, marginBottom: 6 },
    subtitle: { fontSize: 13, color: themePalette.textSecondary, marginBottom: 24 },
    card: { padding: 20, marginBottom: 20 },
    cardText: { fontSize: 13, color: themePalette.textSecondary },
    submitBtn: { alignItems: "center", justifyContent: "center", paddingVertical: 15, borderRadius: 14, backgroundColor: Palette.accentPurple },
    submitBtnText: { fontSize: 15, fontWeight: "700", color: "#fff" },
  });