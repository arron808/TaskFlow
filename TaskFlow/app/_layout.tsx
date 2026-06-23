import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';

// Phase 7: Navigation, Modals, and Notifications
// <Stack />  — Expo Router screen container
// <Toast />  — must be mounted at the root so it floats above all screens
//              Toast.show() calls from any screen will appear here

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </>
  );
}

