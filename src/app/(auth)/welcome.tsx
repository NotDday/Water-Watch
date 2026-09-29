import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import { GlassCard } from "@/components/ui/glass-card";
import { GradientBackground } from "@/components/ui/gradient-background";
import { BorderRadius, Palette, type AppPalette } from "@/constants/theme";
import { useAppTheme } from "@/context/theme-context";

const STAT_ROWS = [
  {
    icon: "radio-outline" as const,
    color: Palette.accentCyan,
    label: "Monitoring stations live",
    value: "3+",
  },
  {
    icon: "analytics-outline" as const,
    color: Palette.accentPurple,
    label: "Risk forecasts, updated hourly",
    value: "24/7",
  },
  {
    icon: "megaphone-outline" as const,
    color: Palette.accentOrange,
    label: "Reports filed by residents so far",
    value: "12",
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const { palette } = useAppTheme();
  const styles = React.useMemo(() => getStyles(palette), [palette]);

  return (
    <GradientBackground>
      {/* Soft wave silhouette anchoring the brand block to the subject matter */}
      <Svg style={styles.waveBg} viewBox="0 0 400 200" preserveAspectRatio="none">
        <Path
          d="M0,80 C60,120 140,40 200,70 C260,100 340,30 400,60 L400,0 L0,0 Z"
          fill={Palette.accentPurple}
          opacity={0.12}
        />
        <Path
          d="M0,100 C80,60 150,140 220,100 C290,60 340,110 400,90 L400,0 L0,0 Z"
          fill={Palette.accentCyan}
          opacity={0.1}
        />
      </Svg>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>

          <Animated.View entering={FadeIn.duration(700)} style={styles.brandBlock}>
            <View style={styles.logoRing}>
              <LinearGradient
                colors={[Palette.accentPurple, Palette.accentBlue, Palette.accentCyan]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoGradient}
              >
                <Ionicons name="water" size={32} color="#fff" />
              </LinearGradient>
            </View>
            <Text style={styles.appName}>Water Watch</Text>
            <Text style={styles.tagline}>Saline intrusion monitoring for Cherthala</Text>
          </Animated.View>

          {/* One unified card with internal rows, not a stack of identical tiles */}
          <Animated.View entering={FadeInDown.duration(500).delay(200)}>
            <GlassCard highlight style={styles.statsCard}>
              {STAT_ROWS.map((row, i) => (
                <React.Fragment key={row.label}>
                  {i > 0 && <View style={styles.statsDivider} />}
                  <View style={styles.statsRow}>
                    <View style={[styles.statsIconWrap, { backgroundColor: row.color + "20" }]}>
                      <Ionicons name={row.icon} size={16} color={row.color} />
                    </View>
                    <Text style={styles.statsLabel}>{row.label}</Text>
                    <Text style={[styles.statsValue, { color: row.color }]}>{row.value}</Text>
                  </View>
                </React.Fragment>
              ))}
            </GlassCard>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(500).delay(420)} style={styles.ctaBlock}>
            <Pressable onPress={() => router.push("/register")} style={({ pressed }) => [pressed && { opacity: 0.85 }]}>
              <LinearGradient
                colors={[Palette.accentPurple, Palette.accentBlue]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryBtn}
              >
                <Text style={styles.primaryBtnText}>Create account</Text>
              </LinearGradient>
            </Pressable>

            <Pressable onPress={() => router.push("/login")} style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.7 }]}>
              <Text style={styles.secondaryBtnText}>
                Already registered? <Text style={styles.secondaryBtnTextAccent}>Log in</Text>
              </Text>
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
    waveBg: { position: "absolute", top: 0, left: 0, right: 0, height: 220 },
    content: { flex: 1, paddingHorizontal: 24, justifyContent: "space-between", paddingVertical: 32 },

    brandBlock: { alignItems: "center", gap: 8, marginTop: 32 },
    logoRing: { shadowColor: Palette.accentPurple, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
    logoGradient: { width: 80, height: 80, borderRadius: 22, alignItems: "center", justifyContent: "center" },
    appName: { fontSize: 26, fontWeight: "800", color: themePalette.textPrimary, letterSpacing: -0.5, marginTop: 6 },
    tagline: { fontSize: 13, color: themePalette.textSecondary, textAlign: "center" },

    statsCard: { padding: 0, gap: 0 },
    statsRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
    statsDivider: { height: 1, backgroundColor: themePalette.glassBorder, marginHorizontal: 14 },
    statsIconWrap: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
    statsLabel: { flex: 1, fontSize: 12.5, color: themePalette.textSecondary, lineHeight: 17 },
    statsValue: { fontSize: 14, fontWeight: "800" },

    ctaBlock: { gap: 14 },
    primaryBtn: { alignItems: "center", justifyContent: "center", paddingVertical: 16, borderRadius: BorderRadius.md },
    primaryBtnText: { fontSize: 15, fontWeight: "700", color: "#fff" },
    secondaryBtn: { alignItems: "center", paddingVertical: 8 },
    secondaryBtnText: { fontSize: 13, color: themePalette.textSecondary },
    secondaryBtnTextAccent: { color: Palette.accentPurple, fontWeight: "700" },
  });