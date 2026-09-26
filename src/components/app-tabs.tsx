import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { useAppTheme } from '@/context/theme-context';

export default function AppTabs() {
  const { palette } = useAppTheme();

  return (
    <NativeTabs
      backgroundColor={palette.bgDeep}
      indicatorColor={palette.accentPurple}
      labelStyle={{
        selected: { color: palette.textPrimary },
        default: { color: palette.textTertiary },
      }}>

      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "house", selected: "house.fill" }}
          md={{ default: "home", selected: "home" }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="monitoring">
        <NativeTabs.Trigger.Label>Monitoring</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "waveform.path.ecg", selected: "waveform.path.ecg" }}
          md={{ default: "sensors", selected: "sensors" }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="complaints">
        <NativeTabs.Trigger.Label>Complaints</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "exclamationmark.bubble", selected: "exclamationmark.bubble.fill" }}
          md={{ default: "warning", selected: "warning" }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "person.crop.circle", selected: "person.crop.circle.fill" }}
          md={{ default: "person", selected: "person" }}
        />
      </NativeTabs.Trigger>

    </NativeTabs>
  );
}
