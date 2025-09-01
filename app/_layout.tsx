import { Stack } from 'expo-router';
import 'react-native-reanimated';

import { AuthProvider } from '@/context/auth';
import { PageProvider } from '@/context/PageProvider';
import { StoryProvider } from '@/context/story';
import { ReaderProvider } from '@/context/ReaderProvider';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ActionSheetProvider>
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
      </ActionSheetProvider>
    </GestureHandlerRootView>
  );
}
