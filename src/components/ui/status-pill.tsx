import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { BorderRadius } from '@/constants/theme';
import { useAppTheme } from '@/context/theme-context';

type Props = {
  label: string;
  color: string;
  glowing?: boolean;
};

export function StatusPill({ label, color, glowing }: Props) {
  const { palette } = useAppTheme();

  return (
    <View style={[styles.wrapper, { backgroundColor: palette.bgCard, borderColor: palette.bgCardBorder }]}>
      {/* Animated glow dot */}
      <View style={[styles.dot, { backgroundColor: color }]}>
        {glowing && (
          <View style={[styles.glowRing, { borderColor: color }]} />
        )}
      </View>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

type GradientPillProps = {
  label: string;
  colors: [string, string];
};

export function GradientPill({ label, colors }: GradientPillProps) {
  const { palette } = useAppTheme();

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradientPill}>
      <Text style={[styles.gradientLabel, { color: palette.textPrimary }]}>{label}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  glowRing: {
    position: 'absolute',
    top: -3,
    left: -3,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    opacity: 0.5,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  gradientPill: {
    borderRadius: BorderRadius.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  gradientLabel: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
});
