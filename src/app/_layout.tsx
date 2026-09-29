import { DarkTheme, DefaultTheme, ThemeProvider as RouterThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {
  MD3DarkTheme,
  Provider as PaperProvider,
} from 'react-native-paper';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { ThemeProvider, useAppTheme } from '@/context/theme-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemedApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

function ThemedApp() {
  const { palette, scheme } = useAppTheme();
  const { isLoggedIn } = useAuth();

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
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={!isLoggedIn}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>
          <Stack.Protected guard={isLoggedIn}>
            <Stack.Screen name="(tabs)" />
          </Stack.Protected>
        </Stack>
      </PaperProvider>
    </RouterThemeProvider>
  );
}