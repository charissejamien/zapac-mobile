import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function InsightFAB() {
  return (
    <TouchableOpacity style={styles.fab}>
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
    bottom: 0,

    width: 56,
    height: 56,

    borderRadius: 28,

    backgroundColor: "#74AFA0",

    justifyContent: "center",
    alignItems: "center",

    elevation: 5,
  },
});