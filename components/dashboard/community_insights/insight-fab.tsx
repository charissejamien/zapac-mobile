import React, { useEffect, useRef } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

import { Plus } from "lucide-react-native";

interface Props {
  onPress: () => void;
  hidden?: boolean;
}

export default function InsightFAB({
  onPress,
  hidden = false,
}: Props) {
  const position = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const dragging = useRef(false);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: hidden ? 0 : 1,
      duration: hidden ? 180 : 220,
      useNativeDriver: true,
    }).start();
  }, [hidden, opacity]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 5 || Math.abs(gesture.dy) > 5,
      onPanResponderGrant: () => {
        dragging.current = true;
      },
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: () => {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          damping: 14,
          stiffness: 170,
          mass: 0.8,
          useNativeDriver: true,
        }).start(() => {
          dragging.current = false;
        });
      },
      onPanResponderTerminate: () => {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start(() => {
          dragging.current = false;
        });
      },
    }),
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      pointerEvents={hidden ? "none" : "auto"}
      style={[
        styles.fabPosition,
        {
          opacity,
          transform: position.getTranslateTransform(),
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.fab}
        onPress={() => {
          if (!dragging.current) onPress();
        }}
        accessibilityRole="button"
        accessibilityLabel="Share a community update"
        accessibilityHint="Drag to temporarily move this button"
      >
        <Plus size={19} color="#FFF" strokeWidth={2.5} />
        <Text style={styles.fabText}>Share</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fabPosition: {
    position: "absolute",
    right: 20,
    bottom: 144,
    elevation: 6,
  },
  fab: {
    minWidth: 104,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#74AFA0",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 17,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#28415E",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
  },
  fabText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
});
