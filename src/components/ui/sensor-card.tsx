import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { BorderRadius, Palette } from '@/constants/theme';

type Props = {
  title: string;
  value: string;
  unit: string;
  icon: string;
  color: string;
  index?: number;
};

export function SensorCard({ title, value, unit, icon, color, index = 0 }: Props) {
  return (
    <Animated.View
      entering={FadeInUp.duration(600).delay(100 * index).springify().damping(18)}
      style={styles.wrapper}>
      <View style={styles.card}>
        <View style={[styles.iconDot, { backgroundColor: color + '25' }]}>
          <Text style={[styles.iconText, { color }]}>{icon}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.valueRow}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.unit}>{unit}</Text>
        </View>
        {/* Subtle accent line at bottom */}
        <LinearGradient
          colors={[color, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.accentLine}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '48%',
    marginBottom: 12,
  },
  card: {
    backgroundColor: Palette.bgCard,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Palette.bgCardBorder,
    padding: 14,
    overflow: 'hidden',
  },
  iconDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconText: {
    fontSize: 18,
  },
  title: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  unit: {
    fontSize: 12,
    color: Palette.textTertiary,
    fontWeight: '500',
  },
  accentLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
});
