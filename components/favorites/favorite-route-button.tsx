import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type FavoriteRouteButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: "outline" | "filled";
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
};

export function FavoriteRouteButton({
  label,
  onPress,
  variant = "filled",
  icon,
  loading = false,
  disabled = false,
}: FavoriteRouteButtonProps) {
  const isOutline = variant === "outline";
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.button,
        isOutline ? styles.outline : styles.filled,
        isDisabled && { opacity: 0.4 },
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={isOutline ? "#527AAF" : "#fff"} />
      ) : (
        <View style={styles.row}>
          {icon}
          <Text style={[styles.label, isOutline ? styles.outlineLabel : styles.filledLabel]}>
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  outline: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#527AAF",
  },
  filled: {
    backgroundColor: "#397968",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
  },
  outlineLabel: {
    color: "#527AAF",
  },
  filledLabel: {
    color: "#FFFFFF",
  },
});
