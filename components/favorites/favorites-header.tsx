import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FavoritesHeaderProps = {
  title?: string;
  showBackButton?: boolean;
  showAddButton?: boolean;
  onAddPress?: () => void;
  onBackPress?: () => void;
};

export const FAVORITES_HEADER_COLOR = "#547aad";

export function FavoritesHeader({
  title = "Favorite Routes",
  showBackButton = true,
  showAddButton = true,
  onAddPress,
  onBackPress,
}: FavoritesHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        { height: insets.top + 46, paddingTop: insets.top },
      ]}
    >
      {showBackButton ? (
        <TouchableOpacity
          accessibilityLabel="Go back"
          onPress={onBackPress}
          style={styles.iconButton}
        >
          <Ionicons name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconButton} />
      )}

      <Text style={styles.title}>{title}</Text>

      {showAddButton ? (
        <TouchableOpacity
          accessibilityLabel="Add favorite route"
          onPress={onAddPress}
          style={styles.iconButton}
        >
          <View>
            <Ionicons name="location-outline" size={28} color="#fff" />
            <Ionicons
              name="add"
              size={16}
              color="#fff"
              style={styles.addIcon}
            />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.iconButton} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    backgroundColor: FAVORITES_HEADER_COLOR,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  iconButton: {
    alignItems: "center",
    height: 46,
    justifyContent: "center",
    width: 34,
  },
  title: {
    color: "#fff",
    fontFamily: Platform.select({ android: "sans-serif" }),
    fontSize: 18,
    fontWeight: "400",
  },
  addIcon: {
    position: "absolute",
    right: -4,
    top: -4,
  },
});
