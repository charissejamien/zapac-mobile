import {
  EmptyFavoritesState,
  FAVORITES_HEADER_COLOR,
  FavoritesHeader,
} from "@/components/favorites";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

export default function FavoriteScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor={FAVORITES_HEADER_COLOR} />

      <FavoritesHeader
        title="Favorite Routes"
        onBackPress={() => router.back()}
        onAddPress={() => router.push("/addFavorites")}
      />
      <EmptyFavoritesState />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
