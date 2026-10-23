// The app's frame. Every file in app/ is a screen (Expo Router): app/index.tsx
// is the first one, app/settings.tsx would be /settings.
//
// It also covers every screen with the waking state while the app's server
// wakes up (components/WakingScreen.tsx; lib/api.ts decides when), so no
// screen has to handle it.
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { getToken } from '../lib/api';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { WakingScreen } from '../components/WakingScreen';
import { useWakingState } from '../lib/api';

export default function RootLayout() {
  const waking = useWakingState();
  const router = useRouter();
  const segments = useSegments();
  const [ready, setReady] = useState(false);
  useEffect(() => { getToken().then((token) => { if (!token && segments[0] !== 'sign-in') router.replace('/sign-in'); setReady(true); }); }, [segments, router]);
  if (!ready) return null;
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style={waking ? 'light' : 'auto'} />
      <Stack screenOptions={{ headerShown: false }} />
      {waking && <WakingScreen state={waking} />}
    </View>
  );
}
