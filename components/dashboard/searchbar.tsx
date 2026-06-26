import { useRouter } from "expo-router";
import { Search, User } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "@/src/theme/app-theme";

export default function SearchBar() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push("/search")}
        style={[
          styles.bar,
          {
            backgroundColor: colors.input,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.searchIcon}>
          <Search
            size={20}
            strokeWidth={2.25}
            color={colors.textMuted}
          />
        </View>

        <Text style={[styles.placeholder, { color: colors.textMuted }]}>
          Where to?
        </Text>

        <View style={styles.profileIconWrapper}>
          <View
            style={[styles.divider, { backgroundColor: colors.border }]}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.iconContainer,
              { backgroundColor: colors.accent },
            ]}
            onPress={() => router.push("/settings")}
          >
            <User size={19} strokeWidth={2.25} color="#FFF" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 12,
    zIndex: 99999,
  },
  bar: {
    height: 58,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  searchIcon: {
    justifyContent: "center",
    alignItems: "center",
    width: 42,
    height: 58,
  },
  placeholder: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    paddingLeft: 4,
  },
  profileIconWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 58,
    paddingRight: 4,
    gap: 10,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 26,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#315D52",
    shadowOpacity: 0.24,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});
