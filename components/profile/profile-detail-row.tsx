import { Feather } from "@expo/vector-icons";
import { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { SETTINGS_COLORS } from "@/components/settings/settings-theme";
import { useAppTheme } from "@/src/theme/app-theme";

type ProfileDetailRowProps = {
  icon: ReactNode;
  label: string;
  onPress: () => void;
  value: string;
};

export function ProfileDetailRow({
  icon,
  label,
  onPress,
  value,
}: ProfileDetailRowProps) {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.row, { backgroundColor: colors.surface }]}
    >
      <View style={[styles.iconBox, { backgroundColor: colors.primarySoft }]}>
        {icon}
      </View>
      <View style={styles.text}>
        <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
        <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      </View>
      <Feather name="chevron-right" size={19} color="#989898" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 54,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: SETTINGS_COLORS.card,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: SETTINGS_COLORS.iconBackground,
  },
  text: {
    flex: 1,
    marginLeft: 12,
  },
  label: {
    color: SETTINGS_COLORS.mutedText,
    fontSize: 10,
  },
  value: {
    marginTop: 2,
    color: SETTINGS_COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },
});
