import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import { useComplaints, submitComplaint, type Complaint } from "@/hooks/useSupabaseData";

type ComplaintStatus = "Submitted" | "Under Investigation" | "Action Taken" | "Resolved";

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
            <Ionicons name="location-outline" size={11} color={palette.textTertiary} />
            <Text style={styles.cardLocation}>{complaint.location}</Text>
          </View>
          <View style={styles.cardFooterRight}>
            <Ionicons name="calendar-outline" size={11} color={palette.textTertiary} />
            <Text style={styles.cardDate}>{formatDate(complaint.created_at)}</Text>
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
  const [showModal, setShowModal] = useState(false);
  const [formCategory, setFormCategory] = useState('Saline Intrusion');
  const [formDescription, setFormDescription] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { complaints, refresh } = useComplaints();

  const counts = TABS.reduce((acc, t) => {
    acc[t] = t === "All" ? complaints.length : complaints.filter((c) => c.status === t).length;
    return acc;
  }, {} as Record<TabId, number>);

  const filtered = activeTab === "All" ? complaints : complaints.filter((c) => c.status === activeTab);

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
            <Pressable style={({ pressed }) => [pressed && { opacity: 0.8 }]} onPress={() => setShowModal(true)}>
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
                <Ionicons name="document-outline" size={40} color={palette.textTertiary} />
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

      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <GlassCard style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Report an Issue</Text>

            <View>
              <Text style={styles.modalLabel}>Category</Text>
              <View style={styles.categoryRow}>
                {(['Saline Intrusion', 'Water Quality', 'Infrastructure', 'Flooding'] as const).map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => setFormCategory(cat)}
                    style={[styles.categoryPill, formCategory === cat && styles.categoryPillActive]}
                  >
                    <Text style={[styles.categoryPillText, formCategory === cat && styles.categoryPillTextActive]}>
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View>
              <Text style={styles.modalLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, { minHeight: 90 }]}
                placeholder="Describe the issue..."
                placeholderTextColor={palette.textTertiary}
                multiline
                numberOfLines={4}
                value={formDescription}
                onChangeText={setFormDescription}
              />
            </View>

            <View>
              <Text style={styles.modalLabel}>Location</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Your location or ward..."
                placeholderTextColor={palette.textTertiary}
                value={formLocation}
                onChangeText={setFormLocation}
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => {
                  setShowModal(false);
                  setFormDescription('');
                  setFormLocation('');
                }}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.submitBtn}
                disabled={submitting}
                onPress={async () => {
                  if (!formDescription.trim()) {
                    Alert.alert('Required', 'Please enter a description.');
                    return;
                  }
                  setSubmitting(true);
                  try {
                    await submitComplaint({
                      category: formCategory,
                      description: formDescription.trim(),
                      location: formLocation.trim() || 'Not specified',
                    });
                    setShowModal(false);
                    setFormDescription('');
                    setFormLocation('');
                    refresh();
                    Alert.alert('Report Submitted', 'Your complaint has been registered.');
                  } catch (e: any) {
                    Alert.alert('Error', e.message ?? 'Failed to submit complaint.');
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                <Text style={styles.submitBtnText}>{submitting ? 'Submitting…' : 'Submit'}</Text>
              </Pressable>
            </View>
          </GlassCard>
        </KeyboardAvoidingView>
      </Modal>
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

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalSheet: { borderRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, gap: 16 },
  modalTitle: { fontSize: 18, fontWeight: '800' as const, color: themePalette.textPrimary },
  modalLabel: { fontSize: 11, fontWeight: '700' as const, color: themePalette.textSecondary, textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 8 },
  categoryRow: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 8 },
  categoryPill: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 16, borderWidth: 1, borderColor: themePalette.glassBorder, backgroundColor: themePalette.glassBackground },
  categoryPillActive: { backgroundColor: Palette.accentPurple + '25', borderColor: Palette.accentPurple },
  categoryPillText: { fontSize: 12, fontWeight: '600' as const, color: themePalette.textSecondary },
  categoryPillTextActive: { color: Palette.accentPurple, fontWeight: '700' as const },
  textInput: { backgroundColor: themePalette.glassBackground, borderWidth: 1, borderColor: themePalette.glassBorder, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: themePalette.textPrimary, fontSize: 14, textAlignVertical: 'top' as const },
  modalActions: { flexDirection: 'row' as const, gap: 12 },
  cancelBtn: { flex: 1, alignItems: 'center' as const, justifyContent: 'center' as const, paddingVertical: 13, borderRadius: 14, borderWidth: 1, borderColor: themePalette.glassBorder },
  cancelBtnText: { fontSize: 15, fontWeight: '600' as const, color: themePalette.textSecondary },
  submitBtn: { flex: 1, alignItems: 'center' as const, justifyContent: 'center' as const, paddingVertical: 13, borderRadius: 14, backgroundColor: Palette.accentPurple },
  submitBtnText: { fontSize: 15, fontWeight: '700' as const, color: '#fff' },
});
