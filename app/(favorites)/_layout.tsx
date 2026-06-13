import { Tabs } from "expo-router";

export default function FavoriteLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}>
      <Tabs.Screen name="favorite-page" options={{ title: "Favorites" }} />
    </Tabs>
  );
}
