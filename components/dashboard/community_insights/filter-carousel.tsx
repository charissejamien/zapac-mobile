import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

const FILTERS = [
  "All",
  "Warning",
  "Shortcuts",
  "Fare Tips",
  "Driver Reviews",
];

interface Props {
  selected: string;
  onSelect: (filter: string) => void;
}

export default function FilterCarousel({ selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.wrapper} // 👈 fixed height wrapper
      contentContainerStyle={styles.container}
    >
      {FILTERS.map((filter) => (
        <TouchableOpacity
          key={filter}
          onPress={() => onSelect(filter)}
          style={[
            styles.button,
            selected === filter && styles.selected,
          ]}
        >
          <Text style={styles.text}>{filter}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    maxHeight: 60, // 36 (button) + 12 top + 12 bottom padding
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12, // centered vertically instead of top-aligned
  },
  button: {
    backgroundColor: "#74AFA0",
    width: 100,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    marginRight: 8,
  },
  selected: {
    opacity: 0.75,
  },
  text: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
});