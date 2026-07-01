import { MapPin } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface TripSummaryProps {
  destinationTitle: string;
  distanceText: string;
}

export default function TripSummary({
  destinationTitle,
  distanceText,
}: TripSummaryProps) {
  return (
    <View style={styles.tripSummaryContainer}>
      <Text style={styles.summaryTitle}>Trip summary</Text>

      <View style={styles.locationRow}>
        <View style={styles.dotIndicator} />
        <View style={styles.textContainer}>
          <Text style={styles.labelPrefix}>Your Location</Text>
          <Text style={styles.locationText} numberOfLines={1}>
            Your Location
          </Text>
        </View>
      </View>

      <View style={styles.connectorLine} />

      <View style={[styles.locationRow, { marginTop: 4 }]}>
        <MapPin size={16} color="#FFF" style={styles.pinIcon} />
        <View style={styles.textContainer}>
          <Text style={styles.labelPrefix}>Destination</Text>
          <Text
            style={[styles.locationText, { fontWeight: "700" }]}
            numberOfLines={2}
          >
            {destinationTitle || "Selected Destination"}
          </Text>
        </View>
      </View>

      <View style={styles.distanceWrapper}>
        <Text style={styles.distanceLabel}>Total Distance</Text>
        <Text style={styles.distanceValue}>
          {distanceText || "Calculating..."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tripSummaryContainer: {
    backgroundColor: "#2A6F97",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  summaryTitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 14,
  },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  textContainer: { flex: 1 },
  labelPrefix: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 10,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  dotIndicator: {
    width: 10,
    height: 10,
    borderRadius: 99,
    backgroundColor: "#FFF",
    marginLeft: 3,
    marginRight: 3,
  },
  pinIcon: { marginLeft: 0 },
  connectorLine: {
    position: "absolute",
    left: 24,
    top: 42,
    width: 2,
    height: 26,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  locationText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "500",
    marginTop: 2,
  },
  distanceWrapper: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  distanceLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontWeight: "600",
  },
  distanceValue: { color: "#FFF", fontSize: 15, fontWeight: "700" },
});
