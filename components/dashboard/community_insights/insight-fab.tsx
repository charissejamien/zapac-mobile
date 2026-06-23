import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { Plus } from "lucide-react-native";

interface Props {
  onPress: () => void;
}

export default function InsightFAB({
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.fab}
      onPress={onPress}
    >
      <Plus size={25} color="#FFF" strokeWidth={2.5} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    bottom: 144,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#74AFA0",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#28415E",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
  },
});
