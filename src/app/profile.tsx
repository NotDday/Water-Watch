import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeInDown, FadeInLeft } from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { GlassCard } from "@/components/ui/glass-card";
import { GradientBackground } from "@/components/ui/gradient-background";
import { Palette , type AppPalette } from "@/constants/theme";
import { type ThemePreference, useAppTheme } from "@/context/theme-context";

type MenuItemProps = {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  value?: string;
  accent?: string;
  danger?: boolean;
  index: number;
  onPress?: () => void;
};

function MenuItem({ icon, label, subtitle, value, accent, danger, index, onPress }: MenuItemProps) {
  const { palette } = useAppTheme();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  return (
    <Animated.View entering={FadeInDown.duration(400).delay(360 + index * 60)}>
      <Pressable onPress={onPress} style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.7 }]}>
        <View style={[styles.menuIconBox, { backgroundColor: (accent ?? Palette.accentPurple) + "20" }]}>
          {icon}
        </View>
        <View style={styles.menuBody}>
          <Text style={[styles.menuLabel, danger && { color: Palette.accentRed }]}>{label}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
        <View style={styles.menuRight}>
          {value && <Text style={styles.menuValue}>{value}</Text>}
          <Ionicons name="chevron-forward" size={14} color={Palette.textTertiary} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

function MenuSection({ title, children }: { title: string; children: React.ReactNode }) {
  const { palette } = useAppTheme();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  return (
    <View style={styles.menuSection}>
      <Text style={styles.menuSectionTitle}>{title}</Text>
      <GlassCard style={styles.menuCard}>{children}</GlassCard>
    </View>
  );
}

function Divider() {
  const { palette } = useAppTheme();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  return <View style={styles.menuDivider} />;
}

export default function ProfileScreen() {
  const { palette } = useAppTheme();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  const { preference, setPreference } = useAppTheme();

  const chooseAppearance = () => {
    const options: { label: string; value: ThemePreference }[] = [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
      { label: "System default", value: "system" },
    ];

    Alert.alert(
      "Appearance",
      "Choose how Water Watch should look.",
      options.map(({ label, value }) => ({
        text: value === preference ? `${label} ✓` : label,
        onPress: () => setPreference(value),
      })),
    );
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* ── Hero identity ──────────────────────── */}
          <Animated.View entering={FadeIn.duration(700)} style={styles.heroSection}>
            {/* Avatar with gradient ring */}
            <View style={styles.avatarFrame}>
              <LinearGradient
                colors={[Palette.accentPurple, Palette.accentBlue, Palette.accentCyan]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarRing}
              >
                <View style={styles.avatarInner}>
                  <Text style={styles.avatarInitials}>JD</Text>
                </View>
              </LinearGradient>
              {/* Online dot */}
              <View style={styles.onlineDot} />
            </View>

            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userHandle}>@johndoe_cherthala</Text>
            <View style={styles.rolePill}>
              <Ionicons name="shield-checkmark-outline" size={11} color={Palette.accentCyan} />
              <Text style={styles.roleText}>Verified Field Agent</Text>
            </View>
          </Animated.View>

          {/* ── Stat pills ─────────────────────────── */}
          <Animated.View entering={FadeInLeft.duration(500).delay(200)} style={styles.statsRow}>
            <GlassCard style={styles.statCard}>
              <Ionicons name="document-text-outline" size={16} color={Palette.accentBlue} />
              <Text style={styles.statVal}>12</Text>
              <Text style={styles.statLab}>Reports</Text>
            </GlassCard>
            <GlassCard style={styles.statCard}>
              <Ionicons name="checkmark-done-outline" size={16} color={Palette.accentGreen} />
              <Text style={styles.statVal}>9</Text>
              <Text style={styles.statLab}>Resolved</Text>
            </GlassCard>
            <GlassCard style={styles.statCard}>
              <Ionicons name="star-outline" size={16} color={Palette.accentYellow} />
              <Text style={styles.statVal}>4.8</Text>
              <Text style={styles.statLab}>Rating</Text>
            </GlassCard>
            <GlassCard style={styles.statCard}>
              <MaterialCommunityIcons name="calendar-check" size={16} color={Palette.accentPurple} />
              <Text style={styles.statVal}>6mo</Text>
              <Text style={styles.statLab}>Active</Text>
            </GlassCard>
          </Animated.View>

          {/* ── Contact info card ─────────────────── */}
          <Animated.View entering={FadeInDown.duration(500).delay(280)}>
            <GlassCard highlight style={styles.contactCard}>
              <View style={styles.contactRow}>
                <View style={[styles.contactIcon, { backgroundColor: Palette.accentBlue + "22" }]}>
                  <Ionicons name="call-outline" size={14} color={Palette.accentBlue} />
                </View>
                <View>
                  <Text style={styles.contactLabel}>Phone</Text>
                  <Text style={styles.contactValue}>+91 98765 43210</Text>
                </View>
              </View>
              <View style={styles.contactDivider} />
              <View style={styles.contactRow}>
                <View style={[styles.contactIcon, { backgroundColor: Palette.accentPurple + "22" }]}>
                  <Ionicons name="mail-outline" size={14} color={Palette.accentPurple} />
                </View>
                <View>
                  <Text style={styles.contactLabel}>Email</Text>
                  <Text style={styles.contactValue}>john@waterwatch.in</Text>
                </View>
              </View>
              <View style={styles.contactDivider} />
              <View style={styles.contactRow}>
                <View style={[styles.contactIcon, { backgroundColor: Palette.accentCyan + "22" }]}>
                  <Ionicons name="location-outline" size={14} color={Palette.accentCyan} />
                </View>
                <View>
                  <Text style={styles.contactLabel}>Region</Text>
                  <Text style={styles.contactValue}>North Cherthala Division</Text>
                </View>
              </View>
            </GlassCard>
          </Animated.View>

          {/* ── Settings sections ──────────────────── */}
          <MenuSection title="Monitoring">
            <MenuItem
              index={0}
              icon={<Ionicons name="notifications-outline" size={16} color={Palette.accentBlue} />}
              label="Alert Preferences"
              subtitle="Risk thresholds & push alerts"
              accent={Palette.accentBlue}
            />
            <Divider />
            <MenuItem
              index={1}
              icon={<MaterialCommunityIcons name="radar" size={16} color={Palette.accentCyan} />}
              label="My Stations"
              subtitle="Manage watched stations"
              value="3"
              accent={Palette.accentCyan}
            />
            <Divider />
            <MenuItem
              index={2}
              icon={<Ionicons name="refresh-circle-outline" size={16} color={Palette.accentGreen} />}
              label="Auto-Refresh Interval"
              subtitle="Data polling frequency"
              value="5 min"
              accent={Palette.accentGreen}
            />
          </MenuSection>

          <MenuSection title="Account">
            <MenuItem
              index={3}
              icon={<Ionicons name="person-outline" size={16} color={Palette.accentPurple} />}
              label="Edit Profile"
              subtitle="Name, photo, bio"
              accent={Palette.accentPurple}
            />
            <Divider />
            <MenuItem
              index={4}
              icon={<Ionicons name="lock-closed-outline" size={16} color={Palette.accentOrange} />}
              label="Change Password"
              accent={Palette.accentOrange}
            />
            <Divider />
            <MenuItem
              index={5}
              icon={<Ionicons name="language-outline" size={16} color={Palette.accentBlue} />}
              label="Language"
              value="English"
              accent={Palette.accentBlue}
            />
          </MenuSection>

          <MenuSection title="App">
            <Animated.View entering={FadeInDown.duration(400).delay(360 + 6 * 60)}>
              <View style={[styles.menuItem, { flexDirection: 'column', alignItems: 'stretch' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={[styles.menuIconBox, { backgroundColor: Palette.accentPurple + '20' }]}>
                    <Ionicons name="color-palette-outline" size={16} color={Palette.accentPurple} />
                  </View>
                  <View style={styles.menuBody}>
                    <Text style={styles.menuLabel}>Appearance</Text>
                    <Text style={styles.menuSubtitle}>Choose light, dark, or follow device</Text>
                  </View>
                </View>
                
                <View style={styles.themePicker}>
                  {(['light', 'dark', 'system'] as const).map((opt) => (
                    <Pressable 
                      key={opt}
                      onPress={() => setPreference(opt)}
                      style={[styles.themeOption, preference === opt && styles.themeOptionActive]}
                    >
                      <Text style={[styles.themeOptionText, preference === opt && styles.themeOptionTextActive]}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </Animated.View>
            <Divider />
            <MenuItem
              index={7}
              icon={<Ionicons name="information-circle-outline" size={16} color={Palette.accentCyan} />}
              label="About"
              subtitle="Water Watch v1.0.0"
              accent={Palette.accentCyan}
            />
            <Divider />
            <MenuItem
              index={8}
              icon={<Ionicons name="document-text-outline" size={16} color={Palette.textSecondary} />}
              label="Privacy Policy"
              accent={Palette.textSecondary}
            />
          </MenuSection>

          {/* ── Logout ────────────────────────────── */}
          <Animated.View entering={FadeInDown.duration(400).delay(860)} style={styles.logoutWrap}>
            <Pressable style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.7 }]}>
              <Ionicons name="log-out-outline" size={18} color={Palette.accentRed} />
              <Text style={styles.logoutText}>Log Out</Text>
            </Pressable>
          </Animated.View>

        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const getStyles = (themePalette: AppPalette) => StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },

  // hero
  heroSection: { alignItems: "center", paddingTop: 16, gap: 6 },
  avatarFrame: { position: "relative", marginBottom: 4 },
  avatarRing: { width: 88, height: 88, borderRadius: 44, padding: 3 },
  avatarInner: { flex: 1, borderRadius: 100, backgroundColor: themePalette.bgDeep, alignItems: "center", justifyContent: "center" },
  avatarInitials: { fontSize: 28, fontWeight: "800", color: themePalette.textPrimary },
  onlineDot: { position: "absolute", bottom: 3, right: 3, width: 14, height: 14, borderRadius: 7, backgroundColor: themePalette.accentGreen, borderWidth: 2, borderColor: themePalette.bgDeep },
  userName: { fontSize: 22, fontWeight: "800", color: themePalette.textPrimary },
  userHandle: { fontSize: 13, color: themePalette.textTertiary },
  rolePill: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: themePalette.accentCyan + "18", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 2 },
  roleText: { fontSize: 11, fontWeight: "600", color: themePalette.accentCyan },

  // stats
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: { flex: 1, alignItems: "center", gap: 4, paddingVertical: 12 },
  statVal: { fontSize: 17, fontWeight: "800", color: themePalette.textPrimary },
  statLab: { fontSize: 9, color: themePalette.textTertiary, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.4 },

  // contact
  contactCard: { gap: 0, padding: 0 },
  contactRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  contactIcon: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  contactLabel: { fontSize: 10, color: themePalette.textTertiary, textTransform: "uppercase", letterSpacing: 0.5 },
  contactValue: { fontSize: 13, fontWeight: "600", color: themePalette.textPrimary, marginTop: 2 },
  contactDivider: { height: 1, backgroundColor: themePalette.glassBorder, marginHorizontal: 14 },

// theme picker
  themePicker: { flexDirection: 'row', backgroundColor: themePalette.glassBackground, borderRadius: 10, padding: 4, marginTop: 14 },
  themeOption: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 8 },
  themeOptionActive: { backgroundColor: themePalette.bgElevated, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  themeOptionText: { fontSize: 13, fontWeight: '600', color: themePalette.textTertiary },
  themeOptionTextActive: { color: themePalette.textPrimary },

  // menu
  menuSection: { gap: 6 },
  menuSectionTitle: { fontSize: 11, fontWeight: "700", color: themePalette.textTertiary, textTransform: "uppercase", letterSpacing: 1, paddingLeft: 4 },
  menuCard: { padding: 0, gap: 0 },
  menuItem: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  menuIconBox: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  menuBody: { flex: 1 },
  menuLabel: { fontSize: 14, fontWeight: "600", color: themePalette.textPrimary },
  menuSubtitle: { fontSize: 11, color: themePalette.textTertiary, marginTop: 1 },
  menuRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  menuValue: { fontSize: 13, color: themePalette.textSecondary },
  menuDivider: { height: 1, backgroundColor: themePalette.glassBorder, marginHorizontal: 14 },

  // logout
  logoutWrap: { alignItems: "center", paddingVertical: 8 },
  logoutBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 12, paddingHorizontal: 28, borderRadius: 14, borderWidth: 1, borderColor: themePalette.accentRed + "50", backgroundColor: themePalette.accentRed + "10" },
  logoutText: { fontSize: 15, fontWeight: "700", color: themePalette.accentRed },
});
