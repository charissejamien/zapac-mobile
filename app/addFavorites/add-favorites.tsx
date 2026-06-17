import { FavoriteRouteButton, FavoritesHeader } from "@/components/favorites";
import { useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const favoriteFields = [
  { label: "Name", placeholder: "Enter route name" },
  { label: "Location", placeholder: "Enter starting location" },
  { label: "Destination", placeholder: "Enter destination" },
];

export default function AddFavorites() {
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerWrapper}>
          <FavoritesHeader
            title="Add Favorite Route"
            showBackButton={true}
            onBackPress={() => router.back()}
            showAddButton={false}
          />
        </View>

        <View style={styles.form}>
          {favoriteFields.map((field) => (
            <View key={field.label} style={styles.fieldGroup}>
              <TextInput
                placeholder={field.placeholder}
                placeholderTextColor="#8A8A8A"
                style={styles.input}
              />
            </View>
          ))}

          <View style={styles.fieldGroup}>
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderText}>
                Map preview placeholder
              </Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <View style={styles.buttonWrapper}>
              <FavoriteRouteButton label="Show Route" variant="outline" />
            </View>
            <View style={styles.buttonWrapper}>
              <FavoriteRouteButton label="Save Route" />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  contentContainer: {
    paddingBottom: 24,
  },
  headerWrapper: {
    marginBottom: 10,
  },
  form: {
    paddingHorizontal: 16,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    color: "#1A1A1A",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#4A6FA5",
    borderRadius: 12,
    borderStyle: "solid",
    borderWidth: 1,
    color: "#1A1A1A",
    fontSize: 16,
    height: 56,
    paddingHorizontal: 14,
  },
  mapPlaceholder: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#4A6FA5",
    borderRadius: 12,
    borderStyle: "dashed",
    borderWidth: 1,
    height: 350,
    justifyContent: "center",
  },
  mapPlaceholderText: {
    color: "#666",
    fontSize: 20,
  },
  actionRow: {
    flexDirection: "column",
    marginTop: 18,
    gap: 16,
  },
  buttonWrapper: {
    width: "100%",
    marginBottom: 16,
  },
});
