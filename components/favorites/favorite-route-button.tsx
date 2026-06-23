import { Pressable, StyleSheet, Text } from "react-native";
import { useAppTheme } from "@/src/theme/app-theme";

type FavoriteRouteButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: "outline" | "filled";
};

export function FavoriteRouteButton({
  label,
  onPress,
  variant = "filled",
}: FavoriteRouteButtonProps) {
  const isOutline = variant === "outline";
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isOutline ? styles.outlineButton : styles.filledButton,
        isOutline
          ? { backgroundColor: colors.surface, borderColor: colors.primary }
          : { backgroundColor: colors.primary, borderColor: colors.primary },
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.label,
          isOutline ? styles.outlineLabel : styles.filledLabel,
          isOutline && { color: colors.primary },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 12,
    elevation: 3,
    width: "100%",
    height: 58,
    justifyContent: "center",
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
  },
  outlineButton: {
    backgroundColor: "#fff",
    borderColor: "#527AAF",
    borderWidth: 2,
  },
  filledButton: {
    backgroundColor: "#527AAF",
    borderColor: "#527AAF",
    borderWidth: 1.5,
  },
  pressed: {
    opacity: 0.82,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  outlineLabel: {
    color: "#3F679F",
  },
  filledLabel: {
    color: "#fff",
  },
});
