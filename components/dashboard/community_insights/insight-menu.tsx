import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface Props {
  visible: boolean;
}

export default function InsightMenu({
  visible,
}: Props) {
  if (!visible) return null;

  return (
    <View style={styles.menu}>
      <TouchableOpacity style={styles.item}>
        <Text>Share</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <Text>Report</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <Text>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: "absolute",
    top: 25,
    right: 0,

    width: 140,

    backgroundColor: "#FFF",
    borderRadius: 10,

    elevation: 5,
    zIndex: 1000,
  },

  item: {
    padding: 12,
  },
});