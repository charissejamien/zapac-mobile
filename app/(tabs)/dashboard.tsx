import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import { BusFront } from "lucide-react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import CommunityInsights, {
  CommunityInsightsRef,
} from "@/components/dashboard/community_insights/community-insights";
import LocatorButton from "@/components/dashboard/locator-button";
import SearchBar from "@/components/dashboard/searchbar";
import TerminalButton from "@/components/dashboard/terminal-button";
import TerminalList from "@/components/dashboard/terminal-list";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.9;
const HEADER_HEIGHT = 70;
const PREVIEW_HEIGHT = 280;
const MINIMIZED_Y = SHEET_HEIGHT - HEADER_HEIGHT;
const COLLAPSED_Y = SHEET_HEIGHT - PREVIEW_HEIGHT;
const EXPANDED_Y = 120;
const SWIPE_THRESHOLD = 60;

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"insights" | "terminals">(
    "insights",
  );
  const [selectedTerminal, setSelectedTerminal] = useState<{
    latitude: number;
    longitude: number;
    title: string;
  } | null>(null);

  const mapRef = useRef<MapView>(null);
  const insightsRef = useRef<CommunityInsightsRef>(null);

  useEffect(() => {
    async function getInitialLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      let location = await Location.getCurrentPositionAsync({});

      mapRef.current?.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        1000,
      );
    }

    getInitialLocation();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (activeTab === "insights") {
        insightsRef.current?.refresh();
      }
    }, [activeTab]),
  );

  const translateY = useRef(new Animated.Value(COLLAPSED_Y)).current;
  const currentSnap = useRef(COLLAPSED_Y);

  const snapTo = (target: number) => {
    currentSnap.current = target;
    Animated.spring(translateY, {
      toValue: target,
      useNativeDriver: true,
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
      setSelectedTerminal(null); // Clear terminal marker when returning to insights
    } else {
      setActiveTab("terminals");
      snapTo(EXPANDED_Y); // Open sheet instantly to reveal listings
    }
  };

  const handleSelectTerminal = (lat: number, lng: number, name: string) => {
    snapTo(MINIMIZED_Y);
    setSelectedTerminal({
      latitude: lat,
      longitude: lng,
      title: name,
    });

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
          if (cur === MINIMIZED_Y) {
            snapTo(COLLAPSED_Y);
          } else {
            snapTo(EXPANDED_Y);
          }
        } else if (gesture.dy > SWIPE_THRESHOLD) {
          if (cur === EXPANDED_Y) {
            snapTo(COLLAPSED_Y);
          } else {
            snapTo(MINIMIZED_Y);
          }
        } else {
          snapTo(cur);
        }
      },
    }),
  ).current;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
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
            anchor={{ x: 0.5, y: 1 }}
          >
            <View style={styles.markerWrapper}>
              <View style={styles.markerLabel}>
                <Text style={styles.markerLabelText} numberOfLines={1}>
                  {selectedTerminal.title}
                </Text>
              </View>

              <View style={styles.markerHalo}>
                <View style={styles.markerBadge}>
                  <BusFront size={21} color="#FFFFFF" />
                </View>
              </View>

              <View style={styles.markerTip} />
            </View>
          </Marker>
        )}
      </MapView>

      <View style={styles.searchContainer}>
        <SearchBar mapRef={mapRef} />
      </View>

      <View style={styles.buttonGroup}>
        <TerminalButton
          active={activeTab === "terminals"}
          onPress={toggleTerminalView}
        />
        <LocatorButton mapRef={mapRef} />
      </View>

      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <View {...panResponder.panHandlers} style={styles.dragHeader}>
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
                      Routes, fares, and terminal details
                    </Text>
                  </View>
                </View>
              ) : (
                <>
                  <Text style={styles.composerPrefix}>Taga</Text>
                  <Text style={styles.brand}>ZAPAC</Text>
                  <Text style={styles.composerSuffix}>says...</Text>
                </>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  buttonGroup: {
    position: "absolute",
    top: 120,
    right: 16,
    zIndex: 90,
    gap: 12,
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: SHEET_HEIGHT,
    backgroundColor: "#F5F7F9",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    elevation: 10,
    zIndex: 110,
  },
  dragHeader: {
    backgroundColor: "#F4BE6C",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  composerWrapper: {
    alignItems: "center",
    alignSelf: "stretch",
  },
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
  composerPrefix: {
    fontSize: 18,
    color: "#3D3D3D",
  },
  brand: {
    fontSize: 26,
    fontWeight: "700",
    color: "#5F8796",
    marginHorizontal: 4,
  },
  composerSuffix: {
    fontSize: 18,
    color: "#3D3D3D",
    marginBottom: 1,
  },
  terminalsTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#26354A",
  },
  terminalsSubtitle: {
    fontSize: 10,
    color: "#715B38",
    marginTop: 1,
  },
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
  markerWrapper: {
    alignItems: "center",
    width: 190,
  },
  markerLabel: {
    maxWidth: 180,
    borderRadius: 10,
    backgroundColor: "#26354A",
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 5,
    shadowColor: "#26354A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  markerLabelText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  markerHalo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(116, 175, 160, 0.24)",
  },
  markerBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#74AFA0",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#26354A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  markerTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 9,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#74AFA0",
    marginTop: -5,
  },
});
