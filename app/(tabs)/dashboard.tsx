import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";

import CommunityInsights, {
  CommunityInsightsRef,
} from "@/components/dashboard/community_insights/community-insights";
import SearchBar from "@/components/dashboard/searchbar";

const SCREEN_HEIGHT =
  Dimensions.get("window").height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.9;
const HEADER_HEIGHT = 70;
const PREVIEW_HEIGHT = 280;
const MINIMIZED_Y =
  SHEET_HEIGHT - HEADER_HEIGHT;
const COLLAPSED_Y =
  SHEET_HEIGHT - PREVIEW_HEIGHT;
const EXPANDED_Y = 120;
const SWIPE_THRESHOLD = 60;

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const insightsRef =
    useRef<CommunityInsightsRef>(null);

  useFocusEffect(
    React.useCallback(() => {
      insightsRef.current?.refresh();
    }, [])
  );

  const translateY = useRef(
    new Animated.Value(COLLAPSED_Y)
  ).current;
  const currentSnap = useRef(COLLAPSED_Y);

  const snapTo = (target: number) => {
    currentSnap.current = target;
    Animated.spring(translateY, {
      toValue: target,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (
        _,
        gesture
      ) => Math.abs(gesture.dy) > 10,

      onPanResponderMove: (_, gesture) => {
        const clamped = Math.max(
          EXPANDED_Y,
          Math.min(
            MINIMIZED_Y,
            currentSnap.current + gesture.dy
          )
        );
        translateY.setValue(clamped);
      },

      onPanResponderRelease: (
        _,
        gesture
      ) => {
        const cur = currentSnap.current;

        if (gesture.dy < -SWIPE_THRESHOLD) {
          if (cur === MINIMIZED_Y) {
            snapTo(COLLAPSED_Y);
          } else {
            snapTo(EXPANDED_Y);
          }
        } else if (
          gesture.dy > SWIPE_THRESHOLD
        ) {
          if (cur === EXPANDED_Y) {
            snapTo(COLLAPSED_Y);
          } else {
            snapTo(MINIMIZED_Y);
          }
        } else {
          snapTo(cur);
        }
      },
    })
  ).current;

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

      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <View
          {...panResponder.panHandlers}
          style={styles.dragHeader}
        >
          <View style={styles.handle} />

          <View style={styles.composer}>
            <Text
              style={styles.composerPrefix}
            >
              Taga
            </Text>

            <Text style={styles.brand}>
              ZAPAC
            </Text>

            <Text
              style={styles.composerSuffix}
            >
              says...
            </Text>
          </View>
        </View>

        <CommunityInsights
          ref={insightsRef}
        />
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

  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: SHEET_HEIGHT,
    backgroundColor: "#F6F6F6",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    elevation: 10,
  },

  dragHeader: {
    backgroundColor: "#F4BE6C",
    alignItems: "center",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
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
});
