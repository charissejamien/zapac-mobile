import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

interface Props {
  onPress: () => void;
}

export default function InsightFAB({
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={onPress}
    >
      <Ionicons
        name="add"
        size={28}
        color="#FFF"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    bottom: 144,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#74AFA0",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
