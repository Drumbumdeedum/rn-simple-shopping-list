import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Entypo } from "@expo/vector-icons";

export default function TabLayout() {
  const theme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[theme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => (
          <View
            style={{
              backgroundColor: Colors[theme ?? "light"].backgroundSecondary,
              borderTopWidth: 1,
              borderColor: Colors[theme ?? "light"].icon,
              flex: 1,
            }}
          />
        ),
        tabBarStyle: Platform.select({
          ios: {
            height: 84,
            paddingTop: 3,
            position: "absolute",
          },
          default: {
            height: 64,
            display: "flex",
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Entypo name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
          tabBarIcon: ({ color }) => (
            <Entypo name="users" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Entypo name="cog" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
