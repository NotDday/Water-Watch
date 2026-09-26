import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { BorderRadius } from '@/constants/theme';
import { useAppTheme } from '@/context/theme-context';

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  highlight?: boolean;
}>;

export function GlassCard({ children, style, highlight }: Props) {
  const { palette } = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: palette.bgCard, borderColor: palette.bgCardBorder },
        highlight && {
          borderColor: palette.accentPurple + '40',
          backgroundColor: palette.bgElevated,
        },
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: 16,
    overflow: 'hidden',
  },
});
