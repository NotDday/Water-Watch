import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlassCard } from "@/components/ui/glass-card";
import { GradientBackground } from "@/components/ui/gradient-background";
import { Palette, type AppPalette } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { useAppTheme } from "@/context/theme-context";

export default function RegisterScreen() {
  const router = useRouter();
  const { palette } = useAppTheme();
  const { signUp } = useAuth();
  const styles = React.useMemo(() => getStyles(palette), [palette]);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleRegister() {
    if (!fullName || !email || !password) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }
    setBusy(true);
    const { error } = await signUp(email.trim(), password, fullName.trim());
    setBusy(false);
    if (error) {
      Alert.alert("Registration failed", error.message);
    } else {
      Alert.alert("Check your email", "We sent a confirmation link to your email address.");
    }
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={20} color={palette.textSecondary} />
          </Pressable>

          <Animated.View entering={FadeIn.duration(500)}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up with your name, email, and password.</Text>

            <GlassCard style={styles.card}>
              <TextInput
                style={styles.input}
                placeholder="Full name"
                placeholderTextColor={palette.textTertiary}
                autoCapitalize="words"
                value={fullName}
                onChangeText={setFullName}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={palette.textTertiary}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={palette.textTertiary}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </GlassCard>

            <Pressable style={styles.submitBtn} onPress={handleRegister} disabled={busy}>
              {busy ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>Create Account</Text>
              )}
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
    card: { padding: 20, marginBottom: 20, gap: 12 },
    input: { fontSize: 15, color: themePalette.textPrimary, backgroundColor: themePalette.bgCard, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: themePalette.bgCardBorder },
    submitBtn: { alignItems: "center", justifyContent: "center", paddingVertical: 15, borderRadius: 14, backgroundColor: Palette.accentPurple },
    submitBtnText: { fontSize: 15, fontWeight: "700", color: "#fff" },
  });