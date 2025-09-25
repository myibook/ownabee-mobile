import { Stack } from 'expo-router';
import 'react-native-reanimated';

import { AuthProvider } from '@/context/auth';
import { PageProvider } from '@/context/PageProvider';
import { StoryProvider } from '@/context/story';
import { ReaderProvider } from '@/context/ReaderProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};
export default function RootLayout() {
  const insets = useSafeAreaInsets();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/*
          only apply bottom padding if device has bottom nav bar
          25 pixel threshold may need testing on other devices
         */}
        <View style={{ flex: 1, paddingBottom: insets.bottom > 25 ? insets.bottom : 0 }}>
          <AuthProvider>
            <PageProvider>
              <StoryProvider>
                <ReaderProvider>
                  <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="select-genre" options={{ headerShown: false }} />
                    <Stack.Screen name="story-editor" options={{ headerShown: false }} />
                    <Stack.Screen name="writing-complete" options={{ headerShown: false }} />
                    <Stack.Screen name="grammar-check" options={{ headerShown: false }} />
                    <Stack.Screen name="grammar-complete" options={{ headerShown: false }} />
                    <Stack.Screen name="image-format" options={{ headerShown: false }} />
                    <Stack.Screen name="generate-image-complete" options={{ headerShown: false }} />
                    <Stack.Screen name="cover-editor" options={{ headerShown: false }} />
                    <Stack.Screen name="cover-complete" options={{ headerShown: false }} />
                    <Stack.Screen name="select-voice" options={{ headerShown: false }} />
                    <Stack.Screen name="story-reader" options={{ headerShown: false }} />
                    <Stack.Screen name="story-detail" options={{ headerShown: false }} />
                  </Stack>
                </ReaderProvider>
              </StoryProvider>
            </PageProvider>
          </AuthProvider>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
