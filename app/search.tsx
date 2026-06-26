import React, { useCallback, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import {
  ArrowLeft,
  Bookmark,
  Clock,
  MapPin,
  Navigation,
  Search,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/src/theme/app-theme";
import { getCachedUserId } from "@/src/lib/supabase";
import { loadSavedRoutes, type SavedRoute } from "@/src/lib/saved-routes";
import {
  addRecentSearch,
  loadRecentSearches,
  type RecentSearch,
} from "@/src/lib/recent-searches";
import { setPendingPlace } from "@/src/lib/search-selection";

const GOOGLE_MAPS_API_KEY = Platform.select({
  ios: "AIzaSyCWHublkXuYaWfT68qUwGY3o5L9NB82JA8",
  android: "AIzaSyAJP6e_5eBGz1j8b6DEKqLT-vest54Atkc",
});

type ListItem =
  | { type: "section"; title: string; icon: "route" | "recent" }
  | { type: "route"; data: SavedRoute }
  | { type: "recent"; data: RecentSearch }
  | { type: "empty"; message: string };

export default function SearchScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      getCachedUserId().then((id) => {
        if (!id) return;
        setUserId(id);
        loadSavedRoutes(id).then(setSavedRoutes);
        loadRecentSearches(id).then(setRecentSearches);
      });
    }, []),
  );

  const handleSelectPlace = async (
    lat: number,
    lng: number,
    name: string,
  ) => {
    if (userId) await addRecentSearch(userId, { latitude: lat, longitude: lng, name });
    setPendingPlace({ latitude: lat, longitude: lng, name });
    router.back();
  };

  const handleSelectRoute = (route: SavedRoute) => {
    setPendingPlace({
      latitude: route.destination_lat,
      longitude: route.destination_lng,
      name: route.destination_address,
    });
    router.back();
  };

  const handleSelectRecent = (recent: RecentSearch) => {
    setPendingPlace({
      latitude: recent.latitude,
      longitude: recent.longitude,
      name: recent.name,
    });
    router.back();
  };

  const listData: ListItem[] = [];

  listData.push({ type: "section", title: "Saved Routes", icon: "route" });
  if (savedRoutes.length > 0) {
    for (const r of savedRoutes) listData.push({ type: "route", data: r });
  } else {
    listData.push({ type: "empty", message: "No saved routes yet" });
  }

  listData.push({
    type: "section",
    title: "Recently Searched",
    icon: "recent",
  });
  if (recentSearches.length > 0) {
    for (const s of recentSearches) listData.push({ type: "recent", data: s });
  } else {
    listData.push({ type: "empty", message: "No recent searches" });
  }

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Search
        </Text>
        <View style={styles.backBtn} />
      </View>

      <View style={[styles.autocompleteWrapper, { zIndex: 1000 }]}>
        <GooglePlacesAutocomplete
          placeholder="Search for a place..."
          fetchDetails
          onPress={(data, details = null) => {
            if (details?.geometry?.location) {
              const { lat, lng } = details.geometry.location;
              handleSelectPlace(lat, lng, data.description);
            }
          }}
          query={{
            key: GOOGLE_MAPS_API_KEY,
            language: "en",
            components: "country:ph",
            location: "10.3157,123.8854",
            radius: "50000",
            strictbounds: true,
          }}
          enablePoweredByContainer={false}
          keyboardShouldPersistTaps="always"
          textInputProps={{
            placeholderTextColor: colors.textMuted,
            autoFocus: true,
          }}
          renderLeftButton={() => (
            <View style={styles.searchIcon}>
              <Search size={18} strokeWidth={2.25} color={colors.textMuted} />
            </View>
          )}
          styles={{
            textInputContainer: [
              styles.inputContainer,
              {
                backgroundColor: colors.input,
                borderColor: colors.border,
              },
            ],
            textInput: [styles.textInput, { color: colors.text }],
            listView: [
              styles.listView,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
              },
            ],
            row: [styles.row, { backgroundColor: colors.surfaceElevated }],
            description: { color: colors.text, fontSize: 14 },
            separator: { backgroundColor: colors.border },
          }}
        />
      </View>

      <FlatList
        data={listData}
        keyExtractor={(_, i) => String(i)}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          if (item.type === "section") {
            return (
              <View style={styles.sectionHeader}>
                {item.icon === "route" ? (
                  <Bookmark size={16} color={colors.primary} />
                ) : (
                  <Clock size={16} color={colors.textMuted} />
                )}
                <Text
                  style={[styles.sectionTitle, { color: colors.text }]}
                >
                  {item.title}
                </Text>
              </View>
            );
          }

          if (item.type === "route") {
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleSelectRoute(item.data)}
                style={[
                  styles.itemCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[styles.routeName, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {item.data.name}
                </Text>
                <View style={styles.routeLocations}>
                  <View style={styles.routePoint}>
                    <MapPin size={12} color="#74AFA0" />
                    <Text
                      style={[styles.routeAddress, { color: colors.textMuted }]}
                      numberOfLines={1}
                    >
                      {item.data.origin_address}
                    </Text>
                  </View>
                  <Text style={[styles.routeArrow, { color: colors.border }]}>
                    →
                  </Text>
                  <View style={styles.routePoint}>
                    <Navigation size={12} color="#C65A43" />
                    <Text
                      style={[styles.routeAddress, { color: colors.textMuted }]}
                      numberOfLines={1}
                    >
                      {item.data.destination_address}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }

          if (item.type === "recent") {
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleSelectRecent(item.data)}
                style={[
                  styles.itemCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.recentRow}>
                  <View
                    style={[
                      styles.recentIcon,
                      { backgroundColor: colors.surfaceMuted },
                    ]}
                  >
                    <Clock size={14} color={colors.textMuted} />
                  </View>
                  <Text
                    style={[styles.recentName, { color: colors.text }]}
                    numberOfLines={2}
                  >
                    {item.data.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              {item.message}
            </Text>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 50,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  autocompleteWrapper: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchIcon: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 48,
  },
  inputContainer: {
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 12,
    height: 52,
  },
  textInput: {
    backgroundColor: "transparent",
    fontSize: 15,
    fontWeight: "500",
    height: 48,
    paddingVertical: 0,
  },
  listView: {
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 6,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    position: "absolute",
    top: 56,
    left: 0,
    right: 0,
    zIndex: 99999,
    overflow: "hidden",
  },
  row: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  itemCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  routeName: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  routeLocations: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  routePoint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  routeAddress: {
    fontSize: 11,
    flex: 1,
  },
  routeArrow: {
    fontSize: 14,
    fontWeight: "700",
  },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  recentIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  recentName: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  emptyText: {
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 16,
  },
});
