import React, { useState } from "react";
import {
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
import { Palette, getRiskColor, type AppPalette } from "@/constants/theme";
import { useAppTheme } from "@/context/theme-context";
import { mockStations, mockCurrentReadings, mockPredictions, Station, SensorReading, Prediction } from "@/data/mockData";

type MetricRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  threshold?: string;
  accent: string;
};

function MetricRow({ icon, label, value, unit, threshold, accent }: MetricRowProps) {
  const { palette } = useAppTheme();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  return (
    <View style={styles.metricRow}>
      <View style={[styles.metricRowIcon, { backgroundColor: accent + "22" }]}>{icon}</View>
      <View style={styles.metricRowBody}>
        <Text style={styles.metricRowLabel}>{label}</Text>
        {threshold && <Text style={styles.metricRowThresh}>Threshold: {threshold}</Text>}
      </View>
      <View style={styles.metricRowRight}>
        <Text style={styles.metricRowValue}>{value}</Text>
        <Text style={styles.metricRowUnit}>{unit}</Text>
      </View>
    </View>
  );
}

function SignalBars({ level }: { level: number }) {
  const { palette } = useAppTheme();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  // level 1-4
  return (
    <View style={styles.signalBarsWrap}>
      {[1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={[
            styles.signalBar,
            { height: 6 + i * 3 },
            i <= level ? styles.signalBarActive : styles.signalBarInactive,
          ]}
        />
      ))}
    </View>
  );
}

type StationCardProps = {
  station: Station;
  readings: SensorReading;
  prediction: Prediction | undefined;
  index: number;
  expanded: boolean;
  onToggle: () => void;
};

function StationCard({ station, readings, prediction, index, expanded, onToggle }: StationCardProps) {
  const { palette } = useAppTheme();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  const riskColor = getRiskColor(prediction?.riskLevel);
  const riskPct = Math.round((prediction?.riskProbability ?? 0) * 100);

  return (
    <Animated.View entering={FadeInDown.duration(500).delay(180 + index * 120)}>
      <GlassCard style={[styles.stationCard, { borderLeftColor: riskColor, borderLeftWidth: 3 }]}>
        {/* Card header row */}
        <Pressable style={styles.stationHeader} onPress={onToggle}>
          {/* Station identity */}
          <View style={styles.stationIdBlock}>
            <View style={[styles.stationIconRing, { borderColor: riskColor + "60" }]}>
              <Ionicons name="radio-outline" size={18} color={riskColor} />
            </View>
            <View style={styles.stationMeta}>
              <Text style={styles.stationName}>{station.name}</Text>
              <View style={styles.stationLocRow}>
                <Ionicons name="location-outline" size={10} color={palette.textTertiary} />
                <Text style={styles.stationLoc}>{station.location}</Text>
              </View>
            </View>
          </View>

          {/* Right: risk + signal */}
          <View style={styles.stationRight}>
            <View style={[styles.riskBadge, { backgroundColor: riskColor + "22", borderColor: riskColor + "50" }]}>
              <Text style={[styles.riskBadgeText, { color: riskColor }]}>{riskPct}%</Text>
            </View>
            <SignalBars level={3} />
            <Ionicons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={14}
              color={palette.textTertiary}
              style={{ marginLeft: 4 }}
            />
          </View>
        </Pressable>

        {/* Risk level strip */}
        <View style={styles.riskStrip}>
          <LinearGradient
            colors={[riskColor + "44", riskColor + "11"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.riskStripGrad, { width: `${riskPct}%` }]}
          />
          <Text style={[styles.riskStripLabel, { color: riskColor }]}>{prediction?.riskLevel ?? "—"} Risk · {prediction?.predictionHorizon} forecast</Text>
        </View>

        {/* Expanded metrics */}
        {expanded && (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.metricsSection}>
            <View style={styles.metricsDivider} />
            <MetricRow
              icon={<MaterialCommunityIcons name="lightning-bolt" size={14} color={Palette.accentCyan} />}
              label="Electrical Conductivity"
              value={readings.ec.toFixed(1)}
              unit="µS/cm"
              threshold="1500 µS/cm"
              accent={Palette.accentCyan}
            />
            <MetricRow
              icon={<MaterialCommunityIcons name="water-opacity" size={14} color={Palette.accentBlue} />}
              label="Total Dissolved Solids"
              value={readings.tds.toFixed(0)}
              unit="ppm"
              threshold="1000 ppm"
              accent={Palette.accentBlue}
            />
            <MetricRow
              icon={<MaterialCommunityIcons name="ph" size={14} color={Palette.accentGreen} />}
              label="pH Level"
              value={readings.ph.toFixed(1)}
              unit="pH"
              threshold="6.5 – 8.5"
              accent={Palette.accentGreen}
            />
            <MetricRow
              icon={<Ionicons name="thermometer-outline" size={14} color={Palette.accentOrange} />}
              label="Temperature"
              value={readings.temperature.toFixed(1)}
              unit="°C"
              accent={Palette.accentOrange}
            />
            <MetricRow
              icon={<Ionicons name="water-outline" size={14} color={Palette.accentBlue} />}
              label="Water Level"
              value={readings.waterLevel.toFixed(2)}
              unit="m"
              accent={Palette.accentBlue}
            />

            {/* Coordinates strip */}
            <View style={styles.coordsRow}>
              <Ionicons name="globe-outline" size={12} color={palette.textTertiary} />
              <Text style={styles.coordsText}>
                {station.coordinates.lat.toFixed(4)}°N · {station.coordinates.lng.toFixed(4)}°E
              </Text>
            </View>
          </Animated.View>
        )}
      </GlassCard>
    </Animated.View>
  );
}

export default function MonitoringScreen() {
  const { palette } = useAppTheme();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  const [expandedId, setExpandedId] = useState<string | null>("ST-001");

  const totalStations = mockStations.length;
  const highRisk = mockPredictions.filter((p) => p.riskLevel === "High" || p.riskLevel === "Critical").length;
  const normal = totalStations - highRisk;

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* ── Header ─────────────────────────────── */}
          <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Live Monitoring</Text>
              <Text style={styles.headerSub}>Real-time saline intrusion data</Text>
            </View>
            <View style={[styles.liveBadge]}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </Animated.View>

          {/* ── Summary stat row ───────────────────── */}
          <Animated.View entering={FadeInLeft.duration(500).delay(100)} style={styles.statRow}>
            <GlassCard style={styles.statCard}>
              <Ionicons name="cellular" size={18} color={Palette.accentBlue} />
              <Text style={styles.statNum}>{totalStations}</Text>
              <Text style={styles.statLabel}>Stations</Text>
            </GlassCard>
            <GlassCard style={styles.statCard}>
              <Ionicons name="checkmark-circle-outline" size={18} color={Palette.accentGreen} />
              <Text style={styles.statNum}>{normal}</Text>
              <Text style={styles.statLabel}>Normal</Text>
            </GlassCard>
            <GlassCard style={styles.statCard}>
              <Ionicons name="warning-outline" size={18} color={Palette.accentOrange} />
              <Text style={styles.statNum}>{highRisk}</Text>
              <Text style={styles.statLabel}>Elevated</Text>
            </GlassCard>
            <GlassCard style={styles.statCard}>
              <MaterialCommunityIcons name="update" size={18} color={Palette.accentPurple} />
              <Text style={styles.statNum}>5m</Text>
              <Text style={styles.statLabel}>Update</Text>
            </GlassCard>
          </Animated.View>

          {/* ── Section label ─────────────────────── */}
          <Animated.View entering={FadeInLeft.duration(400).delay(160)} style={styles.sectionRow}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>Station Reports</Text>
          </Animated.View>

          {/* ── Station cards ─────────────────────── */}
          {mockStations.map((station, idx) => (
            <StationCard
              key={station.id}
              station={station}
              readings={mockCurrentReadings[station.id]}
              prediction={mockPredictions.find((p) => p.stationId === station.id)}
              index={idx}
              expanded={expandedId === station.id}
              onToggle={() => setExpandedId(expandedId === station.id ? null : station.id)}
            />
          ))}

        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const getStyles = (themePalette: AppPalette) => StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 32, gap: 14 },

  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginTop: 8 },
  headerTitle: { fontSize: 22, fontWeight: "800", color: themePalette.textPrimary, letterSpacing: -0.5 },
  headerSub: { fontSize: 12, color: themePalette.textSecondary, marginTop: 2 },
  liveBadge: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: themePalette.accentGreen + "22", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: themePalette.accentGreen },
  liveText: { fontSize: 10, fontWeight: "800", color: themePalette.accentGreen, letterSpacing: 1 },

  statRow: { flexDirection: "row", gap: 10 },
  statCard: { flex: 1, alignItems: "center", gap: 4, paddingVertical: 12, paddingHorizontal: 6 },
  statNum: { fontSize: 18, fontWeight: "800", color: themePalette.textPrimary },
  statLabel: { fontSize: 9, color: themePalette.textTertiary, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },

  sectionRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionAccent: { width: 3, height: 16, borderRadius: 2, backgroundColor: themePalette.accentPurple },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: themePalette.textPrimary },

  // station card
  stationCard: { padding: 0, overflow: "hidden", gap: 0 },
  stationHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16 },
  stationIdBlock: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  stationIconRing: { width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  stationMeta: { flex: 1 },
  stationName: { fontSize: 13, fontWeight: "700", color: themePalette.textPrimary, lineHeight: 17 },
  stationLocRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 2 },
  stationLoc: { fontSize: 11, color: themePalette.textTertiary },
  stationRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  riskBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, borderWidth: 1 },
  riskBadgeText: { fontSize: 12, fontWeight: "800" },
  signalBarsWrap: { flexDirection: "row", alignItems: "flex-end", gap: 2 },
  signalBar: { width: 4, borderRadius: 2 },
  signalBarActive: { backgroundColor: themePalette.accentGreen },
  signalBarInactive: { backgroundColor: themePalette.glassBorder },

  riskStrip: { height: 28, justifyContent: "center", paddingHorizontal: 16, overflow: "hidden" },
  riskStripGrad: { position: "absolute", left: 0, top: 0, bottom: 0 },
  riskStripLabel: { fontSize: 11, fontWeight: "600", letterSpacing: 0.2 },

  metricsSection: { paddingHorizontal: 16, paddingBottom: 14, gap: 10 },
  metricsDivider: { height: 1, backgroundColor: themePalette.glassBorder, marginBottom: 4 },
  metricRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  metricRowIcon: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  metricRowBody: { flex: 1 },
  metricRowLabel: { fontSize: 12, color: themePalette.textSecondary, fontWeight: "500" },
  metricRowThresh: { fontSize: 10, color: themePalette.textTertiary },
  metricRowRight: { alignItems: "flex-end" },
  metricRowValue: { fontSize: 15, fontWeight: "700", color: themePalette.textPrimary },
  metricRowUnit: { fontSize: 10, color: themePalette.textTertiary },

  coordsRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4 },
  coordsText: { fontSize: 10, color: themePalette.textTertiary, fontFamily: "monospace" },
});
