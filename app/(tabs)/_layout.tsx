import { Tabs } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/auth';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import LoginForm from '../sign-in';

export default function TabLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  // Redirect to login screen if not authenticated
  if (!user) {
    return <LoginForm />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.backgroundPurple,
        headerShown: false,
        tabBarLabelPosition: 'below-icon',
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          height: 104,
          paddingTop: 15,
        },
        tabBarLabelStyle: {
          marginTop: 12,
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'eLibrary',
          tabBarActiveTintColor: Colors.black,
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.tabBarBackground,
                { backgroundColor: focused ? Colors.baseBlue : 'transparent' },
              ]}
            >
              <Feather name="home" size={18} color={focused ? 'white' : color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="my-shelf"
        options={{
          title: 'My Shelf',
          tabBarActiveTintColor: Colors.black,
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.tabBarBackground,
                { backgroundColor: focused ? Colors.baseBlue : 'transparent' },
              ]}
            >
              <MaterialCommunityIcons
                name="bookshelf"
                size={24}
                color={focused ? 'white' : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="voice"
        options={{
          title: 'Voice',
          tabBarActiveTintColor: Colors.black,
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.tabBarBackground,
                { backgroundColor: focused ? Colors.baseBlue : 'transparent' },
              ]}
            >
              <MaterialIcons name="multitrack-audio" size={24} color={focused ? 'white' : color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Setting',
          tabBarActiveTintColor: Colors.black,
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.tabBarBackground,
                { backgroundColor: focused ? Colors.baseBlue : 'transparent' },
              ]}
            >
              <Feather name="settings" size={20} color={focused ? 'white' : color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarBackground: {
    borderRadius: 12,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
