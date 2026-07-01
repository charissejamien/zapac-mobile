import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as Location from "expo-location";
import { useFocusEffect, useRouter } from "expo-router";
import { BusFront, Navigation, X } from "lucide-react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

import CommunityInsights, {
  CommunityInsightsRef,
} from "@/components/dashboard/community_insights/community-insights";
import LocatorButton from "@/components/dashboard/locator-button";
import SearchBar from "@/components/dashboard/searchbar";
import TerminalButton from "@/components/dashboard/terminal-button";
import TerminalList from "@/components/dashboard/terminal-list";
import { consumePendingPlace } from "@/src/lib/search-selection";
import { useAppTheme } from "@/src/theme/app-theme";

// 🔥 Import the decode utility directly from your routes component
import { decodePolyline } from "@/app/routes/index";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.9;
const HEADER_HEIGHT = 70;
const MINIMIZED_Y = SHEET_HEIGHT - HEADER_HEIGHT;
const COLLAPSED_Y = SHEET_HEIGHT - 280;
const EXPANDED_Y = 120;
const SWIPE_THRESHOLD = 60;

const GOOGLE_MAPS_API_KEY = Platform.select({
  ios: "AIzaSyCWHublkXuYaWfT68qUwGY3o5L9NB82JA8",
  android: "AIzaSyAJP6e_5eBGz1j8b6DEKqLT-vest54Atkc",
});

export default function Dashboard() {
  const { colors, isDark } = useAppTheme();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"insights" | "terminals">(
    "insights",
  );
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedTerminal, setSelectedTerminal] = useState<{
    latitude: number;
    longitude: number;
    title: string;
  } | null>(null);
  const [searchedPlace, setSearchedPlace] = useState<{
    latitude: number;
    longitude: number;
    title: string;
  } | null>(null);

  // 🔥 Track polyline array points locally inside map dashboard layout
  const [mapRouteCoordinates, setMapRouteCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);

  const mapRef = useRef<MapView>(null);
  const insightsRef = useRef<CommunityInsightsRef>(null);

  async function getUserLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return null;
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    setCurrentLocation(coords);
    return coords;
  }

  // 🔥 RESTORE: Fetch route vectors locally when searching points
  async function fetchLocalMapRoute(
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number,
  ) {
    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${destLat},${destLng}&mode=transit&key=${GOOGLE_MAPS_API_KEY}`;
      const response = await fetch(url);
      const json = await response.json();

      if (json.routes && json.routes.length > 0) {
        const points = decodePolyline(json.routes[0].overview_polyline.points);
        setMapRouteCoordinates(points);
      }
    } catch (err) {
      console.warn("Failed to update local polyline track map frame:", err);
    }
  }

  useEffect(() => {
    getUserLocation().then((coords) => {
      if (coords) {
        mapRef.current?.animateToRegion(
          { ...coords, latitudeDelta: 0.02, longitudeDelta: 0.02 },
          1000,
        );
      }
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (activeTab === "insights") {
        insightsRef.current?.refresh();
      }

      const place = consumePendingPlace();
      if (place) {
        setSelectedTerminal(null);
        const lat = Number(place.latitude);
        const lng = Number(place.longitude);

        setSearchedPlace({ latitude: lat, longitude: lng, title: place.name });
        snapTo(MINIMIZED_Y);

        mapRef.current?.animateToRegion(
          {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          },
          800,
        );

        // 🔥 Trigger local polyline update if current location is loaded
        if (currentLocation) {
          fetchLocalMapRoute(
            currentLocation.latitude,
            currentLocation.longitude,
            lat,
            lng,
          );
        }
      }
    }, [activeTab, currentLocation]),
  );

  const translateY = useRef(new Animated.Value(COLLAPSED_Y)).current;
  const currentSnap = useRef(COLLAPSED_Y);

  const snapTo = (target: number) => {
    currentSnap.current = target;
    Animated.spring(translateY, {
      toValue: target,
      useNativeDriver: true,
      tension: 45,
      friction: 8,
    }).start();
  };

  const handleHeaderPress = () => {
    if (currentSnap.current === EXPANDED_Y) {
      snapTo(MINIMIZED_Y);
    } else {
      snapTo(EXPANDED_Y);
    }
  };

  const toggleTerminalView = () => {
    if (activeTab === "terminals") {
      setActiveTab("insights");
      setSelectedTerminal(null);
    } else {
      setActiveTab("terminals");
      setSearchedPlace(null);
      setMapRouteCoordinates([]); // Clear polyline
      snapTo(EXPANDED_Y);
    }
  };

  const handleSelectTerminal = (lat: number, lng: number, name: string) => {
    snapTo(MINIMIZED_Y);
    setSearchedPlace(null);
    setMapRouteCoordinates([]); // Clear polyline
    setSelectedTerminal({ latitude: lat, longitude: lng, title: name });
    mapRef.current?.animateToRegion(
      {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      },
      1000,
    );
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 10,
      onPanResponderMove: (_, gesture) => {
        const clamped = Math.max(
          EXPANDED_Y,
          Math.min(MINIMIZED_Y, currentSnap.current + gesture.dy),
        );
        translateY.setValue(clamped);
      },
      onPanResponderRelease: (_, gesture) => {
        const cur = currentSnap.current;
        if (gesture.dy < -SWIPE_THRESHOLD) {
          snapTo(cur === MINIMIZED_Y ? COLLAPSED_Y : EXPANDED_Y);
        } else if (gesture.dy > SWIPE_THRESHOLD) {
          snapTo(cur === EXPANDED_Y ? COLLAPSED_Y : MINIMIZED_Y);
        } else {
          snapTo(cur);
        }
      },
    }),
  ).current;

  const handleDirectionsPress = () => {
    if (!searchedPlace) return;

    router.push({
      pathname: "/routes",
      params: {
        title: searchedPlace.title,
        originLat: currentLocation?.latitude,
        originLng: currentLocation?.longitude,
        destLat: searchedPlace.latitude,
        destLng: searchedPlace.longitude,
      },
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        customMapStyle={isDark ? DARK_MAP_STYLE : []}
        style={StyleSheet.absoluteFillObject}
        showsUserLocation={true}
        showsMyLocationButton={false}
        initialRegion={{
          latitude: 10.3113,
          longitude: 123.8937,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {selectedTerminal && (
          <Marker
            coordinate={{
              latitude: selectedTerminal.latitude,
              longitude: selectedTerminal.longitude,
            }}
            title={selectedTerminal.title}
            pinColor="#74AFA0"
          />
        )}

        {searchedPlace && (
          <Marker
            coordinate={{
              latitude: searchedPlace.latitude,
              longitude: searchedPlace.longitude,
            }}
            title={searchedPlace.title}
            pinColor="#C65A43"
          />
        )}

        {/* 🔥 RESTORED POLYLINE RENDERING LAYER */}
        {mapRouteCoordinates.length > 0 && (
          <Polyline
            coordinates={mapRouteCoordinates}
            strokeWidth={5}
            strokeColor="#1E6091"
          />
        )}
      </MapView>

      <View style={styles.searchContainer}>
        <SearchBar />
      </View>

      <View style={styles.buttonGroup}>
        <TerminalButton
          active={activeTab === "terminals"}
          onPress={toggleTerminalView}
        />
        <LocatorButton mapRef={mapRef} />
      </View>

      {searchedPlace && (
        <View
          style={[
            styles.directionsButtonWrapper,
            { bottom: SHEET_HEIGHT - MINIMIZED_Y + 16 },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleDirectionsPress}
            style={[styles.directionsButton, { backgroundColor: "#1E6091" }]}
          >
            <Navigation size={18} color="#FFF" strokeWidth={2.5} />
            <Text style={styles.directionsButtonText}>Directions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              setSearchedPlace(null);
              setMapRouteCoordinates([]); // Clear polyline on dismiss
            }}
            style={[
              styles.closeButton,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
              },
            ]}
          >
            <X size={18} color={colors.text} />
          </TouchableOpacity>
        </View>
      )}

      <Animated.View
        style={[
          styles.sheet,
          { backgroundColor: colors.mapSheet },
          { transform: [{ translateY }] },
        ]}
      >
        <View
          {...panResponder.panHandlers}
          style={[styles.dragHeader, isDark && styles.darkDragHeader]}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleHeaderPress}
            style={styles.composerWrapper}
          >
            <View style={styles.handle} />
            <View style={styles.composer}>
              {activeTab === "terminals" ? (
                <View style={styles.terminalHeader}>
                  <View style={styles.terminalHeaderIcon}>
                    <BusFront size={18} color="#FFFFFF" />
                  </View>
                  <View>
                    <Text style={styles.terminalsTitle}>Cebu terminals</Text>
                    <Text style={styles.terminalsSubtitle}>
                      Routes, fares, and details
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.insightsHeader}>
                  <View style={styles.insightsBrandRow}>
                    <Text style={styles.composerPrefix}>Taga</Text>
                    <Text style={styles.brand}>ZAPAC</Text>
                    <Text style={styles.composerSuffix}>says...</Text>
                  </View>
                  <Text style={styles.insightsSubtitle}>
                    Community Insights
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {activeTab === "terminals" ? (
          <TerminalList onSelectTerminal={handleSelectTerminal} />
        ) : (
          <CommunityInsights ref={insightsRef} />
        )}
      </Animated.View>
    </View>
  );
}

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
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0D1822" }],
  },
];

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  buttonGroup: {
    position: "absolute",
    top: 120,
    right: 16,
    zIndex: 90,
    gap: 12,
  },
  directionsButtonWrapper: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 105,
    flexDirection: "row",
    gap: 10,
  },
  directionsButton: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  directionsButtonText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
  closeButton: {
    width: 50,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: SHEET_HEIGHT,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    zIndex: 110,
  },
  dragHeader: {
    backgroundColor: "#F4BE6C",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  darkDragHeader: { backgroundColor: "#A87938" },
  composerWrapper: { alignItems: "center", alignSelf: "stretch" },
  handle: {
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    marginTop: 10,
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    alignSelf: "stretch",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  insightsHeader: { alignItems: "center", justifyContent: "center" },
  insightsBrandRow: { flexDirection: "row", alignItems: "flex-end" },
  composerPrefix: { fontSize: 17, color: "#3D3D3D", marginBottom: 2 },
  brand: {
    fontSize: 25,
    fontWeight: "800",
    color: "#5F8796",
    marginHorizontal: 4,
  },
  composerSuffix: { fontSize: 17, color: "#3D3D3D", marginBottom: 2 },
  insightsSubtitle: {
    fontSize: 9,
    fontWeight: "800",
    color: "#8A6228",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginTop: 2,
  },
  terminalsTitle: { fontSize: 17, fontWeight: "800", color: "#26354A" },
  terminalsSubtitle: { fontSize: 10, color: "#715B38", marginTop: 1 },
  terminalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  terminalHeaderIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#74AFA0",
    marginRight: 9,
  },
});
