import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeInDown, FadeInLeft, FadeInRight } from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { AnimatedGauge } from "@/components/ui/animated-gauge";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientBackground } from "@/components/ui/gradient-background";
import { BorderRadius, Palette, type AppPalette, getRiskColor } from "@/constants/theme";
import { useAppTheme } from "@/context/theme-context";
import { mockCurrentReadings, mockPredictions, mockStations } from "@/data/mockData";

const { width: SCREEN_W } = Dimensions.get("window");

const METRIC_TILE_W = (SCREEN_W - 48 - 12) / 2;

type MetricTileProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  accentColor: string;
  delay: number;
};

function MetricTile({ icon, label, value, unit, accentColor, delay }: MetricTileProps) {
  const { palette } = useAppTheme();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  return (
    <Animated.View entering={FadeInDown.duration(500).delay(delay)} style={[styles.metricTile, { width: METRIC_TILE_W }]}>
      <GlassCard style={styles.metricCard}>
        <LinearGradient
          colors={[accentColor + "28", "transparent"]}
          style={styles.metricAccent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={[styles.metricIconWrap, { backgroundColor: accentColor + "22" }]}>
          {icon}
        </View>
        <Text style={[styles.metricValue, { color: palette.textPrimary }]}>{value}<Text style={[styles.metricUnit, { color: palette.textSecondary }]}> {unit}</Text></Text>
        <Text style={[styles.metricLabel, { color: palette.textTertiary }]}>{label}</Text>
      </GlassCard>
    </Animated.View>
  );
}

type StationDotProps = {
  id: string;
  active: boolean;
};

function StationDot({ id, active }: StationDotProps) {
  const { palette } = useAppTheme();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  const station = mockStations.find((s) => s.id === id);
  const prediction = mockPredictions.find((p) => p.stationId === id);
  const riskColor = getRiskColor(prediction?.riskLevel);
  return (
    <View style={styles.stationDot}>
      <View style={[styles.dotOuter, { borderColor: riskColor + "60" }]}>
        <View style={[styles.dotInner, { backgroundColor: riskColor }]} />
      </View>
      <Text style={[styles.dotLabel, { color: palette.textTertiary }]}>{station?.location.split(" ")[0]}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const { palette } = useAppTheme();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  const currentStationId = "ST-001";
  const readings = mockCurrentReadings[currentStationId];
  const prediction = mockPredictions.find((p) => p.stationId === currentStationId);

  const riskColor = getRiskColor(prediction?.riskLevel);
  const riskProbability = prediction?.riskProbability ?? 0;
  const riskLabel = prediction?.riskLevel ?? "Unknown";

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* ── Top bar ─────────────────────────────── */}
          <Animated.View entering={FadeIn.duration(600)} style={styles.topBar}>
            <View>
              <Text style={styles.appName}>Water Watch</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-sharp" size={12} color={Palette.accentCyan} />
                <Text style={styles.locationText}>Cherthala, Kerala</Text>
              </View>
            </View>
            <View style={styles.timeBox}>
              <Ionicons name="time-outline" size={12} color={Palette.textTertiary} />
              <Text style={styles.timeText}>{timeStr}</Text>
              <Text style={styles.dateText}>{dateStr}</Text>
            </View>
          </Animated.View>

          {/* ── Live alert banner ───────────────────── */}
          <Animated.View entering={FadeInDown.duration(500).delay(100)}>
            <LinearGradient
              colors={[riskColor + "33", riskColor + "11"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.alertBanner, { borderColor: riskColor + "55" }]}
            >
              <View style={[styles.alertDot, { backgroundColor: riskColor }]} />
              <Text style={[styles.alertText, { color: riskColor }]}>
                {riskLabel === "Low" ? "Conditions Normal" :
                  riskLabel === "Moderate" ? "Moderate salinity detected" :
                  riskLabel === "High" ? "High saline intrusion risk" :
                  "CRITICAL — Action required"}
              </Text>
              <Ionicons name="chevron-forward" size={14} color={riskColor} style={{ marginLeft: "auto" }} />
            </LinearGradient>
          </Animated.View>

          {/* ── Hero risk card ─────────────────────── */}
          <Animated.View entering={FadeInDown.duration(600).delay(180)} style={styles.heroCard}>
            <GlassCard highlight style={styles.heroCardInner}>
              {/* Background glow blob */}
              <View style={[styles.glowBlob, { backgroundColor: riskColor + "18" }]} />

              <View style={styles.heroContent}>
                {/* Left: gauge */}
                <AnimatedGauge
                  value={riskProbability}
                  color={riskColor}
                  label={`${Math.round(riskProbability * 100)}%`}
                  sublabel="Risk"
                  size={130}
                  strokeWidth={10}
                />

                {/* Right: details */}
                <View style={styles.heroDeets}>
                  <View style={[styles.riskBadge, { backgroundColor: riskColor + "22", borderColor: riskColor + "55" }]}>
                    <View style={[styles.riskBadgeDot, { backgroundColor: riskColor }]} />
                    <Text style={[styles.riskBadgeText, { color: riskColor }]}>{riskLabel} Risk</Text>
                  </View>

                  <Text style={styles.heroStation}>Station ST-001</Text>
                  <Text style={styles.heroStationName}>Vembanad Lake Inlet</Text>

                  <View style={styles.heroStatRow}>
                    <Ionicons name="water-outline" size={13} color={Palette.accentCyan} />
                    <Text style={styles.heroStatText}>EC {readings.ec} µS/cm</Text>
                  </View>
                  <View style={styles.heroStatRow}>
                    <MaterialCommunityIcons name="wave" size={13} color={Palette.accentBlue} />
                    <Text style={styles.heroStatText}>Level {readings.waterLevel}m</Text>
                  </View>
                  <View style={styles.heroStatRow}>
                    <Ionicons name="time-outline" size={13} color={Palette.textTertiary} />
                    <Text style={styles.heroStatText}>{prediction?.predictionHorizon} forecast</Text>
                  </View>
                </View>
              </View>

              {/* Station map dots */}
              <View style={styles.stationRow}>
                <Text style={styles.stationRowLabel}>All Stations</Text>
                <View style={styles.stationDots}>
                  {mockStations.map((s) => (
                    <StationDot key={s.id} id={s.id} active={s.id === currentStationId} />
                  ))}
                </View>
              </View>
            </GlassCard>
          </Animated.View>

          {/* ── Section: Live Readings ──────────────── */}
          <Animated.View entering={FadeInLeft.duration(500).delay(280)} style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionDot} />
              <Text style={styles.sectionTitle}>Live Readings</Text>
            </View>
            <View style={styles.livePill}>
              <View style={styles.livePillDot} />
              <Text style={styles.livePillText}>LIVE</Text>
            </View>
          </Animated.View>

          {/* ── 2×2 metric tile grid ───────────────── */}
          <View style={styles.metricGrid}>
            <MetricTile
              icon={<MaterialCommunityIcons name="lightning-bolt" size={18} color={Palette.accentCyan} />}
              label="Electrical Conductivity"
              value={readings.ec.toFixed(0)}
              unit="µS/cm"
              accentColor={Palette.accentCyan}
              delay={300}
            />
            <MetricTile
              icon={<MaterialCommunityIcons name="water-opacity" size={18} color={Palette.accentBlue} />}
              label="Total Dissolved Solids"
              value={readings.tds.toFixed(0)}
              unit="ppm"
              accentColor={Palette.accentBlue}
              delay={360}
            />
            <MetricTile
              icon={<MaterialCommunityIcons name="ph" size={18} color={Palette.accentGreen} />}
              label="pH Level"
              value={readings.ph.toFixed(1)}
              unit="pH"
              accentColor={Palette.accentGreen}
              delay={420}
            />
            <MetricTile
              icon={<Ionicons name="thermometer-outline" size={18} color={Palette.accentOrange} />}
              label="Water Temp"
              value={readings.temperature.toFixed(1)}
              unit="°C"
              accentColor={Palette.accentOrange}
              delay={480}
            />
          </View>

          {/* ── Water level bar ────────────────────── */}
          <Animated.View entering={FadeInDown.duration(500).delay(540)}>
            <GlassCard style={styles.levelCard}>
              <View style={styles.levelHeader}>
                <View style={styles.levelTitleRow}>
                  <Ionicons name="water" size={16} color={Palette.accentBlue} />
                  <Text style={styles.levelTitle}>Water Level</Text>
                </View>
                <Text style={styles.levelValue}>{readings.waterLevel}m</Text>
              </View>
              <View style={styles.levelTrack}>
                <LinearGradient
                  colors={[Palette.accentBlue, Palette.accentCyan]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.levelFill, { width: `${(readings.waterLevel / 5) * 100}%` }]}
                />
              </View>
              <View style={styles.levelScale}>
                <Text style={styles.levelScaleText}>0m</Text>
                <Text style={styles.levelScaleText}>2.5m</Text>
                <Text style={styles.levelScaleText}>5m</Text>
              </View>
            </GlassCard>
          </Animated.View>

          {/* ── Quick actions ─────────────────────── */}
          <Animated.View entering={FadeInDown.duration(500).delay(600)} style={styles.actionsRow}>
            <GlassCard style={styles.actionCard}>
              <Ionicons name="cellular" size={22} color={Palette.accentPurple} />
              <Text style={styles.actionLabel}>Monitoring</Text>
            </GlassCard>
            <GlassCard style={styles.actionCard}>
              <Ionicons name="alert-circle-outline" size={22} color={Palette.accentOrange} />
              <Text style={styles.actionLabel}>Report</Text>
            </GlassCard>
            <GlassCard style={styles.actionCard}>
              <Ionicons name="share-social-outline" size={22} color={Palette.accentCyan} />
              <Text style={styles.actionLabel}>Share</Text>
            </GlassCard>
            <GlassCard style={styles.actionCard}>
              <Ionicons name="notifications-outline" size={22} color={Palette.accentGreen} />
              <Text style={styles.actionLabel}>Alerts</Text>
            </GlassCard>
          </Animated.View>

        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const getStyles = (themePalette: AppPalette) => StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 32, gap: 14 },

  // top bar
  topBar: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginTop: 8, marginBottom: 4 },
  appName: { fontSize: 22, fontWeight: "800", color: themePalette.textPrimary, letterSpacing: -0.5 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  locationText: { fontSize: 12, color: themePalette.textSecondary },
  timeBox: { alignItems: "flex-end", gap: 2 },
  timeText: { fontSize: 16, fontWeight: "700", color: themePalette.textPrimary },
  dateText: { fontSize: 11, color: themePalette.textTertiary },

  // alert banner
  alertBanner: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: BorderRadius.sm, borderWidth: 1 },
  alertDot: { width: 7, height: 7, borderRadius: 4 },
  alertText: { fontSize: 12, fontWeight: "600", letterSpacing: 0.2, flex: 1 },

  // hero card
  heroCard: {},
  heroCardInner: { padding: 18 },
  glowBlob: { position: "absolute", top: -30, right: -30, width: 180, height: 180, borderRadius: 90 },
  heroContent: { flexDirection: "row", alignItems: "center", gap: 16 },
  heroDeets: { flex: 1, gap: 6 },
  riskBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, alignSelf: "flex-start" },
  riskBadgeDot: { width: 6, height: 6, borderRadius: 3 },
  riskBadgeText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  heroStation: { fontSize: 11, color: themePalette.textTertiary, marginTop: 4 },
  heroStationName: { fontSize: 13, fontWeight: "600", color: themePalette.textPrimary, lineHeight: 17 },
  heroStatRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  heroStatText: { fontSize: 11, color: themePalette.textSecondary },
  stationRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: themePalette.glassBorder },
  stationRowLabel: { fontSize: 11, color: themePalette.textTertiary, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1 },
  stationDots: { flexDirection: "row", gap: 14 },
  stationDot: { alignItems: "center", gap: 4 },
  dotOuter: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  dotInner: { width: 7, height: 7, borderRadius: 4 },
  dotLabel: { fontSize: 9, color: themePalette.textTertiary, fontWeight: "600" },

  // section header
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  sectionDot: { width: 3, height: 16, borderRadius: 2, backgroundColor: themePalette.accentPurple },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: themePalette.textPrimary },
  livePill: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: themePalette.accentGreen + "22", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  livePillDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: themePalette.accentGreen },
  livePillText: { fontSize: 9, fontWeight: "800", color: themePalette.accentGreen, letterSpacing: 1 },

  // metric grid
  metricGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  metricTile: {},
  metricCard: { padding: 14, gap: 6, overflow: "hidden" },
  metricAccent: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  metricIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  metricValue: { fontSize: 22, fontWeight: "800", color: themePalette.textPrimary, marginTop: 4 },
  metricUnit: { fontSize: 12, fontWeight: "400", color: themePalette.textSecondary },
  metricLabel: { fontSize: 11, color: themePalette.textTertiary, lineHeight: 15 },

  // water level
  levelCard: { gap: 10 },
  levelHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  levelTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  levelTitle: { fontSize: 14, fontWeight: "600", color: themePalette.textPrimary },
  levelValue: { fontSize: 16, fontWeight: "700", color: themePalette.accentBlue },
  levelTrack: { height: 8, borderRadius: 4, backgroundColor: themePalette.glassBackground, overflow: "hidden" },
  levelFill: { height: "100%", borderRadius: 4 },
  levelScale: { flexDirection: "row", justifyContent: "space-between" },
  levelScaleText: { fontSize: 10, color: themePalette.textTertiary },

  // quick actions
  actionsRow: { flexDirection: "row", gap: 10 },
  actionCard: { flex: 1, alignItems: "center", gap: 8, paddingVertical: 14 },
  actionLabel: { fontSize: 10, fontWeight: "600", color: themePalette.textSecondary, textAlign: "center" },
});
