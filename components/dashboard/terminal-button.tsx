import { BusFront } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface TerminalButtonProps {
  onPress?: () => void;
}

export default function TerminalButton({ onPress }: TerminalButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <BusFront size={20} color="#FFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    width: 55,
    height: 55,
    borderRadius: 15,
    backgroundColor: "#74AFA0",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
