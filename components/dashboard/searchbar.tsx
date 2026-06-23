import { useRouter } from "expo-router";
import { Search, User } from "lucide-react-native";
import React, { useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useAppTheme } from "@/src/theme/app-theme";

interface SearchBarProps {
  mapRef: React.RefObject<any>;
  onSelectPlace?: (lat: number, lng: number, name: string) => void;
}

export default function SearchBar({ mapRef, onSelectPlace }: SearchBarProps) {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);

  const GOOGLE_MAPS_API_KEY = Platform.select({
    ios: "AIzaSyCWHublkXuYaWfT68qUwGY3o5L9NB82JA8",
    android: "AIzaSyAJP6e_5eBGz1j8b6DEKqLT-vest54Atkc",
  });

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Where to?"
        fetchDetails={true}
        onPress={(data, details = null) => {
          if (details?.geometry?.location) {
            const { lat, lng } = details.geometry.location;

            if (onSelectPlace) {
              onSelectPlace(lat, lng, data.description);
            } else {
              mapRef.current?.animateToRegion(
                {
                  latitude: lat,
                  longitude: lng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                },
                1000,
              );
            }
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
        nearbyPlacesAPI="GooglePlacesSearch"
        enablePoweredByContainer={false}
        keyboardShouldPersistTaps="handled"
        textInputProps={{
          onFocus: () => setIsFocused(true),
          onBlur: () => setIsFocused(false),
          placeholderTextColor: colors.textMuted,
          selectionColor: colors.accent,
        }}
        renderLeftButton={() => (
          <View style={styles.searchIcon}>
            <Search
              size={20}
              strokeWidth={2.25}
              color={isFocused ? colors.accent : colors.textMuted}
            />
          </View>
        )}
        renderRightButton={() => (
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
        )}
        styles={{
          textInputContainer: [
            styles.textInputContainer,
            {
              backgroundColor: colors.input,
              borderColor: isFocused ? colors.accent : colors.border,
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
          description: [styles.description, { color: colors.text }],
          separator: [styles.separator, { backgroundColor: colors.border }],
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 12,
    zIndex: 99999,
  },
  textInputContainer: {
    height: 58,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 6,
  },
  textInput: {
    backgroundColor: "transparent",
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 20,
    height: 48,
    paddingLeft: 4,
    paddingRight: 8,
    paddingVertical: 0,
    textAlignVertical: "center",
    flex: 1,
  },
  searchIcon: {
    justifyContent: "center",
    alignItems: "center",
    width: 42,
    height: 58,
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 3,
  },
  listView: {
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 8,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    position: "absolute",
    top: 62,
    left: 0,
    right: 0,
    zIndex: 99999,
    overflow: "hidden",
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
  },
  description: {
    fontSize: 14,
    fontWeight: "500",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
  },
});
