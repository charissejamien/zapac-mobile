import React, { useRef, useState } from "react";
import {
  Animated,
  FlatList,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";

import FilterCarousel from "./filter-carousel";
import InsightCard from "./insight-card";
import InsightFAB from "./insight-fab";

interface Props {
  onClose: () => void;
}

const MOCK_DATA = [
  {
    id: "1",
    userName: "Zoie Laverne",
    avatar: "https://i.pravatar.cc/150?img=1",
    category: "Warning" as const,
    route: "Escario",
    timeAgo: "2 days ago",
    content:
      "Traffic near Escario. Better to walk than wait.",
    likes: 20,
    dislikes: 3,
  },
  {
    id: "2",
    userName: "Megara",
    avatar: "https://i.pravatar.cc/150?img=5",
    category: "Shortcuts" as const,
    route: "Fuente",
    timeAgo: "1 week ago",
    content:
      "Shortcut available through side streets.",
    likes: 10,
    dislikes: 0,
  },
];

export default function CommunityInsights({
  onClose,
}: Props) {
  const [selected, setSelected] =
    useState("All");

  const [openMenuId, setOpenMenuId] =
    useState<string | null>(null);

  const translateY = useRef(
    new Animated.Value(0)
  ).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (
        _,
        gesture
      ) => Math.abs(gesture.dy) > 10,

      onPanResponderMove: (
        _,
        gesture
      ) => {
        if (gesture.dy > 0) {
          translateY.setValue(
            gesture.dy
          );
        }
      },

      onPanResponderRelease: (
        _,
        gesture
      ) => {
        if (gesture.dy > 120) {
          Animated.timing(
            translateY,
            {
              toValue: 600,
              duration: 250,
              useNativeDriver: true,
            }
          ).start(onClose);
        } else {
          Animated.spring(
            translateY,
            {
              toValue: 0,
              useNativeDriver: true,
            }
          ).start();
        }
      },
    })
  ).current;

  const filteredInsights =
    selected === "All"
      ? MOCK_DATA
      : MOCK_DATA.filter(
          (item) =>
            item.category === selected
        );

  return (
    <View style={styles.overlay}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.sheet,
          {
            transform: [
              {
                translateY,
              },
            ],
          },
        ]}
      >
        <View style={styles.topAccent} />

        <View style={styles.handle} />

        <View style={styles.composer}>
          <Text style={styles.composerPrefix}>
            Taga
          </Text>

          <Text style={styles.brand}>
            ZAPAC
          </Text>

          <Text style={styles.composerSuffix}>
            says...
          </Text>
        </View>

        <FilterCarousel
          selected={selected}
          onSelect={setSelected}
        />

        <FlatList
          data={filteredInsights}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingBottom: 24,
          }}
          renderItem={({ item }) => (
            <InsightCard
              insight={item}
              menuVisible={
                openMenuId === item.id
              }
              onMenuToggle={() =>
                setOpenMenuId(
                  openMenuId === item.id
                    ? null
                    : item.id
                )
              }
            />
          )}
        />

        <InsightFAB />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
  },

  sheet: {
    position: "absolute",

    left: 0,
    right: 0,
    bottom: 0,

    height: "80%",

    backgroundColor: "#F6F6F6",

    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    overflow: "hidden",

    elevation: 10,
  },

  topAccent: {
    height: 24,
    backgroundColor: "#E7B45A",
  },

  handle: {
    alignSelf: "center",

    width: 42,
    height: 5,

    borderRadius: 999,

    backgroundColor: "#D0D0D0",

    marginTop: 10,
    marginBottom: 10,
  },

  composer: {
    flexDirection: "row",
    alignItems: "flex-end",

    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  composerPrefix: {
    fontSize: 18,
    color: "#666",
  },

  brand: {
    fontSize: 26,
    fontWeight: "700",
    color: "#5F8796",

    marginHorizontal: 4,
  },

  composerSuffix: {
    fontSize: 18,
    color: "#666",

    marginBottom: 1,
  },
});