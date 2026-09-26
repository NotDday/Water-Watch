import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  FadeInUp,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { Palette } from '@/constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  value: number; // 0–1
  size?: number;
  strokeWidth?: number;
  color: string;
  label: string;
  sublabel?: string;
};

export function AnimatedGauge({
  value,
  size = 140,
  strokeWidth = 10,
  color,
  label,
  sublabel,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(value, {
      duration: 1200,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [value, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <Animated.View entering={FadeInUp.duration(800).delay(200)} style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Palette.glassBorder}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated progress */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          animatedProps={animatedProps}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={[styles.labelContainer, { width: size, height: size }]}>
        <Animated.Text style={[styles.labelText, { color }]}>{label}</Animated.Text>
        {sublabel && (
          <Animated.Text style={styles.sublabelText}>{sublabel}</Animated.Text>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 22,
    fontWeight: '700',
  },
  sublabelText: {
    fontSize: 12,
    color: Palette.textSecondary,
    marginTop: 2,
  },
});

