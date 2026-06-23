import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  AlertTriangle,
  Coins,
  LayoutGrid,
  Route,
  Star,
} from "lucide-react-native";

const FILTERS = [
  { label: "All", icon: LayoutGrid, color: "#527AAF", tint: "#EDF3F8" },
  { label: "Warning", icon: AlertTriangle, color: "#C65A43", tint: "#FFF0EC" },
  { label: "Shortcuts", icon: Route, color: "#527AAF", tint: "#EDF3F8" },
  { label: "Fare Tips", icon: Coins, color: "#A66A19", tint: "#FFF4E2" },
  {
    label: "Driver Reviews",
    icon: Star,
    color: "#397968",
    tint: "#E7F2EF",
  },
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
      style={styles.wrapper}
      contentContainerStyle={styles.container}
    >
      {FILTERS.map((filter) => (
        <TouchableOpacity
          key={filter.label}
          activeOpacity={0.8}
          onPress={() => onSelect(filter.label)}
          style={[
            styles.button,
            selected === filter.label && {
              backgroundColor: filter.tint,
              borderColor: filter.color,
            },
          ]}
        >
          <View style={styles.icon}>
            <filter.icon
              size={13}
              color={filter.color}
            />
          </View>
          <Text
            style={[
              styles.text,
              selected === filter.label && { color: filter.color },
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    maxHeight: 62,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "transparent",
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 19,
    marginRight: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E1E7EC",
  },
  icon: {
    marginRight: 6,
  },
  text: {
    color: "#536274",
    fontSize: 11,
    fontWeight: "700",
  },
});
