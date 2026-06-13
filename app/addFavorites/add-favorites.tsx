import { Text, View } from "react-native";
import { FavoritesHeader } from "../../components/favorites/favorites-header";

export default function AddFavorites() {
  return (
    <View>
      <FavoritesHeader
        title="Add Favorite Route"
        showBackButton={true}
        showAddButton={false}
      />
      <Text>Welcome to add favorites</Text>
    </View>
  );
}
