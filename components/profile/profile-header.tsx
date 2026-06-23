import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SETTINGS_HEADER_GRADIENT } from "@/components/settings/settings-theme";

type ProfileHeaderProps = {
  email: string;
  name: string;
  onBack: () => void;
};

export function ProfileHeader({ email, name, onBack }: ProfileHeaderProps) {
  return (
    <LinearGradient colors={SETTINGS_HEADER_GRADIENT}>
      <SafeAreaView edges={["top"]} style={styles.header}>
        <View style={styles.toolbar}>
          <TouchableOpacity
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            onPress={onBack}
          >
            <Feather name="arrow-left" size={27} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <View style={styles.spacer} />
        </View>

        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {name.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
          <Text style={styles.name}>{name || "User"}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 28,
  },
  toolbar: {
    height: 60,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "500",
  },
  spacer: {
    width: 27,
  },
  identity: {
    alignItems: "center",
    paddingTop: 12,
  },
  avatar: {
    width: 78,
    height: 78,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 39,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "700",
  },
  name: {
    marginTop: 12,
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  email: {
    marginTop: 4,
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
  },
});
