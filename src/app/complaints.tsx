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
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { GlassCard } from "@/components/ui/glass-card";
import { GradientBackground } from "@/components/ui/gradient-background";
import { Palette , type AppPalette } from "@/constants/theme";
import { useAppTheme } from "@/context/theme-context";
import { mockComplaints, ComplaintStatus, Complaint } from "@/data/mockData";

const STATUS_CONFIG: Record<ComplaintStatus, { color: string; icon: keyof typeof Ionicons.glyphMap; label: string }> = {
  Submitted: { color: Palette.accentBlue, icon: "paper-plane-outline", label: "Submitted" },
  "Under Investigation": { color: Palette.accentOrange, icon: "search-outline", label: "Investigating" },
  "Action Taken": { color: Palette.accentPurple, icon: "build-outline", label: "Action Taken" },
  Resolved: { color: Palette.accentGreen, icon: "checkmark-circle-outline", label: "Resolved" },
};

const CATEGORY_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  "Saline Intrusion": "water-outline",
  "Water Quality": "flask-outline",
  "Infrastructure": "construct-outline",
  "Flooding": "rainy-outline",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

type ComplaintCardProps = {
  complaint: Complaint;
  index: number;
  isLast: boolean;
};

function ComplaintCard({ complaint, index, isLast }: ComplaintCardProps) {
  const { palette } = useAppTheme();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  const cfg = STATUS_CONFIG[complaint.status];
  const catIcon = CATEGORY_ICON[complaint.category] ?? "document-outline";

  return (
    <Animated.View entering={FadeInDown.duration(500).delay(240 + index * 100)} style={styles.cardWrap}>
      {/* Timeline connector line */}
      {!isLast && <View style={[styles.timelineLine, { backgroundColor: cfg.color + "30" }]} />}
      {/* Timeline dot */}
      <View style={[styles.timelineDot, { backgroundColor: cfg.color, shadowColor: cfg.color }]} />

      <GlassCard style={styles.complaintCard}>
        {/* Top accent strip */}
        <LinearGradient
          colors={[cfg.color + "30", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.cardAccentStrip}
        />

        {/* Header row */}
        <View style={styles.cardHeader}>
          <View style={[styles.categoryIconWrap, { backgroundColor: cfg.color + "20" }]}>
            <Ionicons name={catIcon} size={16} color={cfg.color} />
          </View>
          <View style={styles.cardTitleBlock}>
            <Text style={styles.cardCategory}>{complaint.category}</Text>
            <Text style={styles.cardId}>#{complaint.id}</Text>
          </View>
          <View style={[styles.statusPill, { backgroundColor: cfg.color + "22", borderColor: cfg.color + "50" }]}>
            <Ionicons name={cfg.icon} size={10} color={cfg.color} />
            <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.cardDesc} numberOfLines={2}>{complaint.description}</Text>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <View style={styles.cardFooterLeft}>
            <Ionicons name="location-outline" size={11} color={Palette.textTertiary} />
            <Text style={styles.cardLocation}>{complaint.location}</Text>
          </View>
          <View style={styles.cardFooterRight}>
            <Ionicons name="calendar-outline" size={11} color={Palette.textTertiary} />
            <Text style={styles.cardDate}>{formatDate(complaint.createdAt)}</Text>
          </View>
        </View>
      </GlassCard>
    </Animated.View>
  );
}

type TabId = ComplaintStatus | "All";
const TABS: TabId[] = ["All", "Submitted", "Under Investigation", "Action Taken", "Resolved"];

export default function ComplaintsScreen() {
  const { palette } = useAppTheme();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  const [activeTab, setActiveTab] = useState<TabId>("All");

  const counts = TABS.reduce((acc, t) => {
    acc[t] = t === "All" ? mockComplaints.length : mockComplaints.filter((c) => c.status === t).length;
    return acc;
  }, {} as Record<TabId, number>);

  const filtered = activeTab === "All" ? mockComplaints : mockComplaints.filter((c) => c.status === activeTab);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* ── Header ─────────────────────────────── */}
          <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Complaints</Text>
              <Text style={styles.headerSub}>Track your field reports</Text>
            </View>
            {/* New complaint CTA */}
            <Pressable style={({ pressed }) => [pressed && { opacity: 0.8 }]}>
              <LinearGradient
                colors={[Palette.accentPurple, Palette.accentBlue]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.newBtn}
              >
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.newBtnText}>Report</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* ── Status summary tiles ───────────────── */}
          <Animated.View entering={FadeInLeft.duration(500).delay(100)} style={styles.summaryRow}>
            {(["Submitted", "Under Investigation", "Action Taken", "Resolved"] as ComplaintStatus[]).map((s) => {
              const cfg = STATUS_CONFIG[s];
              return (
                <GlassCard key={s} style={styles.summaryCard}>
                  <Ionicons name={cfg.icon} size={16} color={cfg.color} />
                  <Text style={[styles.summaryNum, { color: cfg.color }]}>{counts[s]}</Text>
                  <Text style={styles.summaryLabel}>{cfg.label.split(" ")[0]}</Text>
                </GlassCard>
              );
            })}
          </Animated.View>

          {/* ── Filter tabs ────────────────────────── */}
          <Animated.View entering={FadeInLeft.duration(400).delay(160)}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
              {TABS.map((tab) => {
                const active = activeTab === tab;
                const cfg = tab !== "All" ? STATUS_CONFIG[tab as ComplaintStatus] : null;
                return (
                  <Pressable
                    key={tab}
                    style={[
                      styles.filterTab,
                      active && { backgroundColor: (cfg?.color ?? Palette.accentPurple) + "28", borderColor: (cfg?.color ?? Palette.accentPurple) + "60" },
                    ]}
                    onPress={() => setActiveTab(tab)}
                  >
                    {cfg && <Ionicons name={cfg.icon} size={11} color={active ? cfg.color : Palette.textTertiary} />}
                    <Text style={[styles.filterTabText, active && { color: cfg?.color ?? Palette.accentPurple }]}>
                      {tab === "All" ? "All" : cfg!.label}
                    </Text>
                    {counts[tab] > 0 && (
                      <View style={[styles.filterBadge, { backgroundColor: (cfg?.color ?? Palette.accentPurple) + "33" }]}>
                        <Text style={[styles.filterBadgeText, { color: cfg?.color ?? Palette.accentPurple }]}>{counts[tab]}</Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Animated.View>

          {/* ── Timeline feed ─────────────────────── */}
          <View style={styles.timeline}>
            {filtered.length === 0 ? (
              <Animated.View entering={FadeIn} style={styles.emptyState}>
                <Ionicons name="document-outline" size={40} color={Palette.textTertiary} />
                <Text style={styles.emptyText}>No complaints in this category</Text>
              </Animated.View>
            ) : (
              filtered.map((c, i) => (
                <ComplaintCard key={c.id} complaint={c} index={i} isLast={i === filtered.length - 1} />
              ))
            )}
          </View>

        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const getStyles = (themePalette: AppPalette) => StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 32, gap: 14 },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  headerTitle: { fontSize: 22, fontWeight: "800", color: themePalette.textPrimary, letterSpacing: -0.5 },
  headerSub: { fontSize: 12, color: themePalette.textSecondary, marginTop: 2 },
  newBtn: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20 },
  newBtnText: { fontSize: 13, fontWeight: "700", color: "#fff" },

  summaryRow: { flexDirection: "row", gap: 10 },
  summaryCard: { flex: 1, alignItems: "center", gap: 4, paddingVertical: 12, paddingHorizontal: 4 },
  summaryNum: { fontSize: 20, fontWeight: "800" },
  summaryLabel: { fontSize: 9, color: themePalette.textTertiary, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.4 },

  tabsRow: { flexDirection: "row", gap: 8, paddingRight: 4 },
  filterTab: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: themePalette.glassBorder, backgroundColor: themePalette.glassBackground },
  filterTabText: { fontSize: 12, fontWeight: "600", color: themePalette.textTertiary },
  filterBadge: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8 },
  filterBadgeText: { fontSize: 10, fontWeight: "700" },

  timeline: { paddingLeft: 20, gap: 12 },
  cardWrap: { position: "relative" },
  timelineLine: { position: "absolute", left: -12, top: 26, width: 2, bottom: -14 },
  timelineDot: { position: "absolute", left: -16, top: 16, width: 8, height: 8, borderRadius: 4, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 4, elevation: 3 },

  complaintCard: { padding: 0, overflow: "hidden" },
  cardAccentStrip: { height: 3 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, paddingBottom: 8 },
  categoryIconWrap: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  cardTitleBlock: { flex: 1 },
  cardCategory: { fontSize: 13, fontWeight: "700", color: themePalette.textPrimary },
  cardId: { fontSize: 10, color: themePalette.textTertiary, marginTop: 1 },
  statusPill: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, borderWidth: 1 },
  statusText: { fontSize: 10, fontWeight: "700" },

  cardDesc: { fontSize: 12, color: themePalette.textSecondary, paddingHorizontal: 14, lineHeight: 17 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 14, paddingVertical: 10, marginTop: 6, borderTopWidth: 1, borderTopColor: themePalette.glassBorder },
  cardFooterLeft: { flexDirection: "row", alignItems: "center", gap: 4 },
  cardLocation: { fontSize: 11, color: themePalette.textTertiary },
  cardFooterRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  cardDate: { fontSize: 11, color: themePalette.textTertiary },

  emptyState: { alignItems: "center", gap: 10, paddingVertical: 40 },
  emptyText: { fontSize: 14, color: themePalette.textTertiary },
});
