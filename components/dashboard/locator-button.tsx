import * as Location from "expo-location";
import { Locate } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";

interface GeoButtonProps {
  mapRef: React.RefObject<MapView | null>;
}

export default function LocatorButton({ mapRef }: GeoButtonProps) {
  const focusUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    let location = await Location.getCurrentPositionAsync({});

    mapRef.current?.animateToRegion(
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000,
    );
  };

  return (
    <TouchableOpacity style={styles.button} onPress={focusUserLocation}>
      <Locate size={20} color="#FFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 55,
    height: 55,
    borderRadius: 15,
    backgroundColor: "#74AFA0",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
