import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useRouter } from "expo-router";
import { Bookmark, MapPin, Navigation, Route } from "lucide-react-native";

import { FavoriteRouteButton, FavoritesHeader } from "@/components/favorites";
import { useAppTheme } from "@/src/theme/app-theme";
import { getCachedUserId } from "@/src/lib/supabase";
import {
  type SavedRoute,
  decodePolyline,
  fetchDirections,
  saveRoute,
} from "@/src/lib/saved-routes";

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#17212D" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#AAB8C9" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#17212D" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2D3B49" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1B2634" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0D1822" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#1B2634" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#253246" }],
  },
];

const GOOGLE_MAPS_API_KEY = Platform.select({
  ios: "AIzaSyCWHublkXuYaWfT68qUwGY3o5L9NB82JA8",
  android: "AIzaSyAJP6e_5eBGz1j8b6DEKqLT-vest54Atkc",
});

interface PlaceInfo {
  lat: number;
  lng: number;
  address: string;
}

export default function AddFavorites() {
  const router = useRouter();
  const { colors, isDark } = useAppTheme();
  const mapRef = useRef<MapView>(null);

  const [name, setName] = useState("");
  const [origin, setOrigin] = useState<PlaceInfo | null>(null);
  const [destination, setDestination] = useState<PlaceInfo | null>(null);
  const [routeCoords, setRouteCoords] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [encodedPolyline, setEncodedPolyline] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleShowRoute = async () => {
    if (!origin || !destination) {
      Alert.alert(
        "Missing info",
        "Please select both a starting location and destination.",
      );
      return;
    }

    setLoading(true);
    const encoded = await fetchDirections(
      { lat: origin.lat, lng: origin.lng },
      { lat: destination.lat, lng: destination.lng },
    );

    if (!encoded) {
      Alert.alert(
        "No route found",
        "Could not find a route between these locations.",
      );
      setLoading(false);
      return;
    }

    const coords = decodePolyline(encoded);
    setEncodedPolyline(encoded);
    setRouteCoords(coords);
    setShowMap(true);
    setLoading(false);

    setTimeout(() => {
      mapRef.current?.fitToCoordinates(coords, {
        edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
        animated: true,
      });
    }, 500);
  };

  const handleSaveRoute = async () => {
    if (!name.trim()) {
      Alert.alert("Missing name", "Please enter a route name.");
      return;
    }
    if (!origin || !destination) {
      Alert.alert(
        "Missing locations",
        "Please select both a starting location and destination.",
      );
      return;
    }
    if (!encodedPolyline) {
      Alert.alert(
        "Show route first",
        "Please tap 'Show Route' to preview before saving.",
      );
      return;
    }

    setSaving(true);

    const userId = await getCachedUserId();
    if (!userId) {
      setSaving(false);
      return;
    }

    const route: SavedRoute = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      user_id: userId,
      name: name.trim(),
      origin_address: origin.address,
      origin_lat: origin.lat,
      origin_lng: origin.lng,
      destination_address: destination.address,
      destination_lat: destination.lat,
      destination_lng: destination.lng,
      encoded_polyline: encodedPolyline,
      created_at: new Date().toISOString(),
    };

    await saveRoute(route);
    setSaving(false);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={[]}
        renderItem={null}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={
          <>
            <View style={styles.headerWrapper}>
              <FavoritesHeader
                title="Add Favorite Route"
                showBackButton
                onBackPress={() => router.back()}
                showAddButton={false}
              />
            </View>

            <View style={styles.form}>
              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Route Name
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Home to Work"
                  placeholderTextColor={colors.textMuted}
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.primary,
                      color: colors.text,
                    },
                  ]}
                />
              </View>

              <View style={[styles.fieldGroup, { zIndex: 3000 }]}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Starting Location
                </Text>
                <GooglePlacesAutocomplete
                  placeholder="Enter starting location"
                  fetchDetails
                  onPress={(data, details = null) => {
                    if (details?.geometry?.location) {
                      const { lat, lng } = details.geometry.location;
                      setOrigin({ lat, lng, address: data.description });
                      setShowMap(false);
                      setRouteCoords([]);
                      setEncodedPolyline("");
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
                  }}
                  renderLeftButton={() => (
                    <View style={styles.inputIcon}>
                      <MapPin size={18} color="#74AFA0" />
                    </View>
                  )}
                  styles={{
                    textInputContainer: [
                      styles.placesContainer,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.primary,
                      },
                    ],
                    textInput: [styles.placesInput, { color: colors.text }],
                    listView: [
                      styles.placesList,
                      {
                        backgroundColor: colors.surfaceElevated,
                        borderColor: colors.border,
                      },
                    ],
                    row: [
                      styles.placesRow,
                      { backgroundColor: colors.surfaceElevated },
                    ],
                    description: { color: colors.text, fontSize: 14 },
                    separator: { backgroundColor: colors.border },
                  }}
                />
              </View>

              <View style={[styles.fieldGroup, { zIndex: 2000 }]}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Destination
                </Text>
                <GooglePlacesAutocomplete
                  placeholder="Enter destination"
                  fetchDetails
                  onPress={(data, details = null) => {
                    if (details?.geometry?.location) {
                      const { lat, lng } = details.geometry.location;
                      setDestination({ lat, lng, address: data.description });
                      setShowMap(false);
                      setRouteCoords([]);
                      setEncodedPolyline("");
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
                  }}
                  renderLeftButton={() => (
                    <View style={styles.inputIcon}>
                      <Navigation size={18} color="#C65A43" />
                    </View>
                  )}
                  styles={{
                    textInputContainer: [
                      styles.placesContainer,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.primary,
                      },
                    ],
                    textInput: [styles.placesInput, { color: colors.text }],
                    listView: [
                      styles.placesList,
                      {
                        backgroundColor: colors.surfaceElevated,
                        borderColor: colors.border,
                      },
                    ],
                    row: [
                      styles.placesRow,
                      { backgroundColor: colors.surfaceElevated },
                    ],
                    description: { color: colors.text, fontSize: 14 },
                    separator: { backgroundColor: colors.border },
                  }}
                />
              </View>

              <View style={[styles.fieldGroup, { zIndex: 1000 }]}>
                {showMap && routeCoords.length > 0 && origin && destination ? (
                  <View style={styles.mapContainer}>
                    <MapView
                      ref={mapRef}
                      provider={PROVIDER_GOOGLE}
                      customMapStyle={isDark ? DARK_MAP_STYLE : []}
                      style={styles.map}
                      scrollEnabled={false}
                      zoomEnabled={false}
                      initialRegion={{
                        latitude: origin.lat,
                        longitude: origin.lng,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                      }}
                    >
                      <Marker
                        coordinate={{
                          latitude: origin.lat,
                          longitude: origin.lng,
                        }}
                        title="Start"
                        pinColor="#74AFA0"
                      />
                      <Marker
                        coordinate={{
                          latitude: destination.lat,
                          longitude: destination.lng,
                        }}
                        title="Destination"
                        pinColor="#E53935"
                      />
                      <Polyline
                        coordinates={routeCoords}
                        strokeColor="#527AAF"
                        strokeWidth={4}
                      />
                    </MapView>
                  </View>
                ) : (
                  <View
                    style={[
                      styles.mapPlaceholder,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.primary,
                      },
                    ]}
                  >
                    {loading ? (
                      <>
                        <ActivityIndicator size="large" color={colors.accent} />
                        <Text
                          style={[
                            styles.mapPlaceholderText,
                            { color: colors.textMuted, marginTop: 10 },
                          ]}
                        >
                          Finding route...
                        </Text>
                      </>
                    ) : (
                      <Text
                        style={[
                          styles.mapPlaceholderText,
                          { color: colors.textMuted },
                        ]}
                      >
                        Select locations and tap "Show Route"
                      </Text>
                    )}
                  </View>
                )}
              </View>

              <View style={[styles.actionRow, { zIndex: 500 }]}>
                <FavoriteRouteButton
                  label="Show Route"
                  variant="outline"
                  icon={<Route size={20} color={colors.primary} />}
                  loading={loading}
                  onPress={handleShowRoute}
                />
                <FavoriteRouteButton
                  label="Save Route"
                  icon={<Bookmark size={20} color="#fff" />}
                  loading={saving}
                  disabled={!encodedPolyline}
                  onPress={handleSaveRoute}
                />
              </View>
            </View>
          </>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
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
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 15,
    height: 52,
    paddingHorizontal: 14,
  },
  inputIcon: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 52,
  },
  placesContainer: {
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8,
  },
  placesInput: {
    backgroundColor: "transparent",
    fontSize: 15,
    height: 50,
    paddingVertical: 0,
  },
  placesList: {
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
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
  placesRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  mapContainer: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  map: {
    height: 300,
    borderRadius: 16,
  },
  mapPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderStyle: "dashed",
    borderWidth: 1,
    height: 300,
  },
  mapPlaceholderText: {
    fontSize: 14,
  },
  actionRow: {
    flexDirection: "column",
    marginTop: 16,
    gap: 16,
    paddingBottom: 20,
  },
});
