import { useRouter } from "expo-router";
import { Search, User } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

interface SearchBarProps {
  mapRef: React.RefObject<any>;
  onSelectPlace?: (lat: number, lng: number, name: string) => void;
}

export default function SearchBar({ mapRef, onSelectPlace }: SearchBarProps) {
  const router = useRouter();

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
        renderLeftButton={() => (
          <View style={styles.searchIcon}>
            <Search size={22} color="#7A7A7A" />
          </View>
        )}
        renderRightButton={() => (
          <View style={styles.profileIconWrapper}>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => router.push("/settings")}
            >
              <User size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}
        styles={{
          textInputContainer: styles.textInputContainer,
          textInput: styles.textInput,
          listView: styles.listView,
          row: styles.row,
          description: styles.description,
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
    backgroundColor: "#F9F9F9",
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
  },
  textInput: {
    backgroundColor: "transparent",
    fontSize: 16,
    color: "#000",
    height: "100%",
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1,
  },
  searchIcon: {
    justifyContent: "center",
    alignItems: "center",
    height: 56,
  },
  profileIconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    height: 56,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#74AFA0",
    justifyContent: "center",
    alignItems: "center",
  },
  listView: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginTop: 5,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    zIndex: 99999,
  },
  row: {
    padding: 13,
    height: 44,
    flexDirection: "row",
    backgroundColor: "#FFF",
  },
  description: {
    fontSize: 14,
    color: "#333",
  },
});
