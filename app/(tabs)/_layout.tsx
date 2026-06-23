import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { HapticTab } from "@/components/haptic-tab";
import { useAppTheme } from "@/src/theme/app-theme";

export default function TabLayout() {
  const { colors, isDark } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FFFFFF",
        tabBarActiveBackgroundColor: isDark
          ? "rgba(255,255,255,0.12)"
          : "rgba(255,255,255,0.16)",
        tabBarInactiveTintColor: "rgba(255,255,255,0.68)",
        tabBarButton: HapticTab,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
        },
        tabBarStyle: {
          height: 80,
          paddingHorizontal: 6,
          paddingTop: 7,
          paddingBottom: 15,
          borderTopWidth: 0,
          backgroundColor: isDark ? "#18283B" : colors.primary,
        },
        tabBarItemStyle: {
          marginHorizontal: 10,
          borderRadius: 10,
          overflow: "hidden",
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="heart" size={18} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-sharp" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
