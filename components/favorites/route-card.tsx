import React from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MapPin, Navigation, Trash2 } from "lucide-react-native";
import { useAppTheme } from "@/src/theme/app-theme";
import { SavedRoute } from "@/src/lib/saved-routes";

interface Props {
  route: SavedRoute;
  onDelete: () => void;
  onPress: () => void;
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000,
  );
  const mins = Math.floor(seconds / 60);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

export function RouteCard({ route, onDelete, onPress }: Props) {
  const { colors } = useAppTheme();

  const handleDelete = () => {
    Alert.alert("Delete route", `Remove "${route.name}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: onDelete },
    ]);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.nameRow}>
          <Text
            style={[styles.name, { color: colors.text }]}
            numberOfLines={1}
          >
            {route.name}
          </Text>
          <Text style={[styles.time, { color: colors.textMuted }]}>
            {timeAgo(route.created_at)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.deleteBtn}
        >
          <Trash2 size={16} color={colors.danger} />
        </TouchableOpacity>
      </View>

      <View style={styles.locations}>
        <View style={styles.locationRow}>
          <View
            style={[styles.iconDot, { backgroundColor: "#E7F2EF" }]}
          >
            <MapPin size={12} color="#74AFA0" />
          </View>
          <Text
            style={[styles.address, { color: colors.textMuted }]}
            numberOfLines={1}
          >
            {route.origin_address}
          </Text>
        </View>

        <View style={styles.connector}>
          <View
            style={[styles.connectorLine, { borderColor: colors.border }]}
          />
        </View>

        <View style={styles.locationRow}>
          <View
            style={[styles.iconDot, { backgroundColor: "#FFF0EC" }]}
          >
            <Navigation size={12} color="#C65A43" />
          </View>
          <Text
            style={[styles.address, { color: colors.textMuted }]}
            numberOfLines={1}
          >
            {route.destination_address}
          </Text>
        </View>
      </View>

      <View style={styles.tapHint}>
        <Text style={[styles.tapHintText, { color: colors.primary }]}>
          Tap to view route on map
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  nameRow: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
  },
  time: {
    fontSize: 10,
    marginTop: 2,
  },
  deleteBtn: {
    padding: 4,
  },
  locations: {
    marginTop: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  address: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },
  connector: {
    paddingLeft: 13,
    height: 14,
    justifyContent: "center",
  },
  connectorLine: {
    width: 0,
    height: 14,
    borderLeftWidth: 1.5,
    borderStyle: "dashed",
  },
  tapHint: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  tapHintText: {
    fontSize: 10,
    fontWeight: "600",
  },
});
