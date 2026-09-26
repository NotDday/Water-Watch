import { LinearGradient } from 'expo-linear-gradient';
import { PropsWithChildren } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

import { useAppTheme } from '@/context/theme-context';

type Props = PropsWithChildren<{ style?: ViewStyle }>;

export function GradientBackground({ children, style }: Props) {
  const { palette } = useAppTheme();

  return (
    <LinearGradient
      colors={[palette.gradientStart, palette.gradientMid, palette.gradientEnd]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.gradient, style]}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
