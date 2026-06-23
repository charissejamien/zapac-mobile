import { Platform, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/src/theme/app-theme";

export function EmptyFavoritesState() {
  const { colors } = useAppTheme();

  return (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyText, { color: colors.text }]}>You have no favorite routes yet.</Text>
      <Text style={[styles.emptyText, { color: colors.text }]}>Click the + icon to add one!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingBottom: 20,
  },
  emptyText: {
    color: "#111",
    fontFamily: Platform.select({ android: "sans-serif" }),
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
});
