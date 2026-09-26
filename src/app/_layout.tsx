import { DarkTheme, DefaultTheme, ThemeProvider as RouterThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {
  Provider as PaperProvider,
  MD3DarkTheme,
} from 'react-native-paper';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { ThemeProvider, useAppTheme } from '@/context/theme-context';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

function ThemedApp() {
  const { palette, scheme } = useAppTheme();
  const paperTheme = {
    ...(scheme === 'dark' ? MD3DarkTheme : undefined),
    colors: {
      ...(scheme === 'dark' ? MD3DarkTheme.colors : {}),
      primary: palette.accentPurple,
      background: palette.bgDeep,
      surface: palette.bgDeep,
      surfaceVariant: palette.bgCard,
    },
  };
  const baseNavTheme = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...baseNavTheme,
    colors: {
      ...baseNavTheme.colors,
      background: 'transparent',
      card: palette.bgDeep,
    },
  };

  return (
    <RouterThemeProvider value={navTheme}>
      <PaperProvider theme={paperTheme}>
        <AnimatedSplashOverlay />
        <AppTabs />
      </PaperProvider>
    </RouterThemeProvider>
  );
}
