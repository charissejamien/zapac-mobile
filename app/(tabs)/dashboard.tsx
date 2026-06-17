import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import MapView, {
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";

import CommunityInsights from "@/components/dashboard/community_insights/community-insights";
import SearchBar from "@/components/dashboard/searchbar";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [showInsights, setShowInsights] =
    useState(false);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: 10.3113,
          longitude: 123.8937,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Marker
          coordinate={{
            latitude: 10.3113,
            longitude: 123.8937,
          }}
        />
      </MapView>

      <View style={styles.searchContainer}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {!showInsights && (
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.communityPreview}
          onPress={() =>
            setShowInsights(true)
          }
        >
          <View style={styles.handle} />

          <Text style={styles.previewText}>
            Community Insights
          </Text>
        </TouchableOpacity>
      )}

      {showInsights && (
        <CommunityInsights
          onClose={() =>
            setShowInsights(false)
          }
        />
      )}
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

  communityPreview: {
    position: "absolute",

    left: 0,
    right: 0,

    bottom: 0,

    height: 60,

    backgroundColor: "#F4BE6C",

    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    alignItems: "center",
  },

  handle: {
    width: 42,
    height: 5,

    borderRadius: 999,

    backgroundColor: "#FFFFFF",

    marginTop: 8,
  },

  previewText: {
    marginTop: 10,

    fontSize: 14,
    fontWeight: "600",

    color: "#3D3D3D",
  },
});