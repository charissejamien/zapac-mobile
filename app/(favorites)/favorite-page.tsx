import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function FavoriteScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar
        style="light"
        backgroundColor={styles.header.backgroundColor}
      />

      <View style={styles.header}>
        <TouchableOpacity
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={styles.iconButton}
        >
          <Ionicons name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Favorite Routes</Text>

        <TouchableOpacity
          accessibilityLabel="Add favorite route"
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
      </View>

      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>You have no favorite routes yet.</Text>
        <Text style={styles.emptyText}>Click the + icon to add one!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 46,
    alignItems: "center",
    backgroundColor: "#547aad",
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
    fontSize: 18,
    fontWeight: "400",
  },
  addIcon: {
    position: "absolute",
    right: -4,
    top: -4,
  },
  emptyState: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingBottom: 20,
  },
  emptyText: {
    color: "#111",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
});
