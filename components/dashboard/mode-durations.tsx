import { Bus, Car, Motorbike } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface ModeDurationsProps {
  loading: boolean;
  transitTime: string;
  motoTime: string;
  carTime: string;
  textColor: string;
  surfaceColor: string;
  borderColor: string;
}

export default function ModeDurations({
  loading,
  transitTime,
  motoTime,
  carTime,
  textColor,
  surfaceColor,
  borderColor,
}: ModeDurationsProps) {
  if (loading) {
    return (
      <View style={styles.loaderArea}>
        <ActivityIndicator size="small" color="#1E6091" />
        <Text style={{ color: "#777", fontSize: 13, marginTop: 6 }}>
          Fetching timings...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.modesContainer}>
      <View
        style={[
          styles.modeCard,
          { backgroundColor: surfaceColor, borderColor },
        ]}
      >
        <View style={styles.modeLeftRow}>
          <View style={[styles.modeIconBox, { backgroundColor: "#1E6091" }]}>
            <Bus size={18} color="#FFF" />
          </View>
          <Text style={[styles.modeLabel, { color: textColor }]}>Bus</Text>
        </View>
        <Text style={[styles.modeDurationText, { color: textColor }]}>
          {transitTime}
        </Text>
      </View>

      <View
        style={[
          styles.modeCard,
          { backgroundColor: surfaceColor, borderColor },
        ]}
      >
        <View style={styles.modeLeftRow}>
          <View style={[styles.modeIconBox, { backgroundColor: "#4CAF50" }]}>
            <Motorbike size={18} color="#FFF" />
          </View>
          <Text style={[styles.modeLabel, { color: textColor }]}>
            Moto Taxi
          </Text>
        </View>
        <Text style={[styles.modeDurationText, { color: textColor }]}>
          {motoTime}
        </Text>
      </View>

      <View
        style={[
          styles.modeCard,
          { backgroundColor: surfaceColor, borderColor },
        ]}
      >
        <View style={styles.modeLeftRow}>
          <View style={[styles.modeIconBox, { backgroundColor: "#FF9800" }]}>
            <Car size={18} color="#FFF" />
          </View>
          <Text style={[styles.modeLabel, { color: textColor }]}>
            Car / Taxi
          </Text>
        </View>
        <Text style={[styles.modeDurationText, { color: textColor }]}>
          {carTime}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loaderArea: { padding: 24, alignItems: "center", justifyContent: "center" },
  modesContainer: { gap: 8, marginBottom: 14 },
  modeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  modeLeftRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  modeIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modeLabel: { fontSize: 14, fontWeight: "600" },
  modeDurationText: { fontSize: 14, fontWeight: "700" },
});
