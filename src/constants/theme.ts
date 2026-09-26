import '@/global.css';

import { Platform } from 'react-native';

// ─── Premium dark-first palette inspired by Atlas Cue / Air Quality apps ───

export const Palette = {
  // Deep backgrounds
  bgDeep: '#0A0A1A',
  bgCard: 'rgba(255,255,255,0.06)',
  bgCardBorder: 'rgba(255,255,255,0.10)',
  bgElevated: 'rgba(255,255,255,0.09)',

  // Gradient stops (purple → deep blue)
  gradientStart: '#1A0533',
  gradientMid: '#0D1B3E',
  gradientEnd: '#060B1A',

  // Accent colors
  accentBlue: '#4DA8FF',
  accentCyan: '#00E5CC',
  accentPurple: '#A855F7',
  accentPink: '#F472B6',
  accentOrange: '#FB923C',
  accentGreen: '#34D399',
  accentRed: '#EF4444',
  accentYellow: '#FACC15',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.60)',
  textTertiary: 'rgba(255,255,255,0.35)',

  // Risk colors
  riskLow: '#34D399',
  riskModerate: '#FACC15',
  riskHigh: '#FB923C',
  riskCritical: '#EF4444',

  // Glass
  glassBackground: 'rgba(255,255,255,0.05)',
  glassBorder: 'rgba(255,255,255,0.12)',
  glassHighlight: 'rgba(255,255,255,0.08)',
} as const;

export const LightPalette = {
  ...Palette,
  bgDeep: '#F4F7FB',
  bgCard: 'rgba(255,255,255,0.88)',
  bgCardBorder: 'rgba(30,41,59,0.12)',
  bgElevated: '#FFFFFF',
  gradientStart: '#E7F0FF',
  gradientMid: '#F4F7FB',
  gradientEnd: '#FFFFFF',
  textPrimary: '#10213A',
  textSecondary: '#52637A',
  textTertiary: '#718096',
  glassBackground: 'rgba(255,255,255,0.78)',
  glassBorder: 'rgba(30,41,59,0.12)',
  glassHighlight: 'rgba(255,255,255,0.95)',
} as const;

export type ColorScheme = 'light' | 'dark';
export type AppPalette = typeof Palette | typeof LightPalette;

export function getPalette(scheme: ColorScheme): AppPalette {
  return scheme === 'light' ? LightPalette : Palette;
}

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export function getRiskColor(level?: string) {
  switch (level) {
    case 'Low':
      return Palette.riskLow;
    case 'Moderate':
      return Palette.riskModerate;
    case 'High':
      return Palette.riskHigh;
    case 'Critical':
      return Palette.riskCritical;
    default:
      return Palette.textTertiary;
  }
}
