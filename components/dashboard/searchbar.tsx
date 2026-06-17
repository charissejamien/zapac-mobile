import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchBar({
  value,
  onChangeText,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search"
        size={22}
        color="#7A7A7A"
      />

      <TextInput
        placeholder="Where to?"
        placeholderTextColor="#7A7A7A"
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
      />

      <TouchableOpacity>
        <Ionicons
          name="happy"
          size={28}
          color="#6ABF4B"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#F9F9F9",

    marginHorizontal: 16,
    marginTop: 12,

    paddingHorizontal: 14,
    height: 56,

    borderRadius: 16,

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
  },
});