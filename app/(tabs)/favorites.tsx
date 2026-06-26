import React, { useCallback, useRef, useState } from "react";
import { FlatList, Modal, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from "react-native-maps";

import {
  EmptyFavoritesState,
  FAVORITES_HEADER_COLOR,
  FavoritesHeader,
  RouteCard,
} from "@/components/favorites";
import { useAppTheme } from "@/src/theme/app-theme";
import { getCachedUserId } from "@/src/lib/supabase";
import {
  type SavedRoute,
  decodePolyline,
  deleteSavedRoute,
  loadSavedRoutes,
  syncRoutesFromSupabase,
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

export default function FavoriteScreen() {
  const router = useRouter();
  const { colors, isDark } = useAppTheme();
  const [routes, setRoutes] = useState<SavedRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<SavedRoute | null>(null);
  const modalMapRef = useRef<MapView>(null);

  const refreshRoutes = useCallback(async () => {
    const userId = await getCachedUserId();
    if (!userId) return;

    const local = await loadSavedRoutes(userId);
    setRoutes(local);

    await syncRoutesFromSupabase(userId);
    const synced = await loadSavedRoutes(userId);
    setRoutes(synced);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshRoutes();
    }, [refreshRoutes]),
  );

  const handleDelete = async (id: string) => {
    const userId = await getCachedUserId();
    if (!userId) return;

    await deleteSavedRoute(userId, id);
    setRoutes((prev) => prev.filter((r) => r.id !== id));
  };

  const routeCoords = selectedRoute
    ? decodePolyline(selectedRoute.encoded_polyline)
    : [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" backgroundColor={FAVORITES_HEADER_COLOR} />

      <FavoritesHeader
        title="Favorite Routes"
        onBackPress={() => router.back()}
        onAddPress={() => router.push("/addFavorites")}
      />

      {routes.length === 0 ? (
        <EmptyFavoritesState />
      ) : (
        <FlatList
          data={routes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <RouteCard
              route={item}
              onDelete={() => handleDelete(item.id)}
              onPress={() => setSelectedRoute(item)}
            />
          )}
        />
      )}

      <Modal
        visible={!!selectedRoute}
        animationType="slide"
        onRequestClose={() => setSelectedRoute(null)}
      >
        {selectedRoute && (
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <FavoritesHeader
              title={selectedRoute.name}
              showBackButton
              onBackPress={() => setSelectedRoute(null)}
              showAddButton={false}
            />
            <MapView
              ref={modalMapRef}
              provider={PROVIDER_GOOGLE}
              customMapStyle={isDark ? DARK_MAP_STYLE : []}
              style={styles.modalMap}
              onMapReady={() => {
                if (routeCoords.length > 0) {
                  modalMapRef.current?.fitToCoordinates(routeCoords, {
                    edgePadding: {
                      top: 80,
                      right: 80,
                      bottom: 80,
                      left: 80,
                    },
                    animated: true,
                  });
                }
              }}
              initialRegion={{
                latitude:
                  (selectedRoute.origin_lat + selectedRoute.destination_lat) / 2,
                longitude:
                  (selectedRoute.origin_lng + selectedRoute.destination_lng) / 2,
                latitudeDelta:
                  Math.abs(
                    selectedRoute.origin_lat - selectedRoute.destination_lat,
                  ) *
                    2 +
                  0.02,
                longitudeDelta:
                  Math.abs(
                    selectedRoute.origin_lng - selectedRoute.destination_lng,
                  ) *
                    2 +
                  0.02,
              }}
            >
              <Marker
                coordinate={{
                  latitude: selectedRoute.origin_lat,
                  longitude: selectedRoute.origin_lng,
                }}
                title="Start"
                description={selectedRoute.origin_address}
                pinColor="#74AFA0"
              />
              <Marker
                coordinate={{
                  latitude: selectedRoute.destination_lat,
                  longitude: selectedRoute.destination_lng,
                }}
                title="Destination"
                description={selectedRoute.destination_address}
                pinColor="#E53935"
              />
              <Polyline
                coordinates={routeCoords}
                strokeColor="#527AAF"
                strokeWidth={4}
              />
            </MapView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingTop: 14,
    paddingBottom: 24,
  },
  modalContainer: {
    flex: 1,
  },
  modalMap: {
    flex: 1,
  },
});
