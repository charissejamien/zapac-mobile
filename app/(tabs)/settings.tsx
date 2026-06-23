import { supabase } from "@/src/lib/supabase";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { SettingsHeader } from "@/components/settings/settings-header";
import { SettingsRow } from "@/components/settings/settings-row";
import { SettingsSection } from "@/components/settings/settings-section";
import { SETTINGS_COLORS } from "@/components/settings/settings-theme";
import { useAppTheme } from "@/src/theme/app-theme";

export default function SettingsScreen() {
  const { colors, isDark, setDarkMode } = useAppTheme();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userId, setUserId] = useState("");
  const [editingUsername, setEditingUsername] = useState(false);
  const [draftUsername, setDraftUsername] = useState("");
  const [deleteStep, setDeleteStep] = useState<0 | 1 | 2>(0);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const { data } = await supabase
        .from("profiles")
        .select("username, email, avatar_url")
        .eq("id", user.id)
        .single();
      if (data) {
        setUsername(data.username ?? "");
        setEmail(data.email ?? user.email ?? "");
        setAvatarUrl(data.avatar_url ?? "");
      }
    };
    fetchProfile();
  }, []);

  const pickAvatar = async () => {
    const { status, canAskAgain } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      if (!canAskAgain) {
        Alert.alert(
          "Permission required",
          "Photo access was denied. Please enable it in your device Settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ],
        );
      }
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (result.canceled) return;

    const uri = result.assets[0].uri;
    const ext = uri.split(".").pop() ?? "jpg";
    const path = `${userId}/avatar.${ext}`;

    // Show the local image immediately so the user sees instant feedback
    setAvatarUrl(uri);

    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, arrayBuffer, { contentType: `image/${ext}`, upsert: true });

    if (uploadError) {
      Alert.alert("Upload failed", uploadError.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);
    // Append timestamp to bust the CDN cache when the same path is overwritten
    const bustUrl = `${publicUrl}?t=${Date.now()}`;

    await supabase
      .from("profiles")
      .update({ avatar_url: bustUrl })
      .eq("id", userId);
    setAvatarUrl(bustUrl);
  };

  const openEditUsername = () => {
    setDraftUsername(username);
    setEditingUsername(true);
  };

  const saveUsername = async () => {
    const trimmed = draftUsername.trim();
    if (!trimmed) return;
    await supabase
      .from("profiles")
      .update({ username: trimmed })
      .eq("id", userId);
    setUsername(trimmed);
    setEditingUsername(false);
  };

  const deleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;
    const { error } = await supabase.rpc("delete_user");
    if (error) {
      Alert.alert("Error", error.message);
      return;
    }
    await supabase.auth.signOut();
    router.replace("/(auth)/login");
  };

  const confirmLogout = () => {
    Alert.alert(
      "Log out?",
      "You will need to sign in again to access your account.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log out",
          style: "destructive",
          onPress: async () => {
            await supabase.auth.signOut();
            router.replace("/(auth)/login");
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      <SettingsHeader
        email={email}
        name={username}
        avatarUrl={avatarUrl}
        onAvatarPress={pickAvatar}
        onEditUsername={openEditUsername}
        onEditProfile={() => router.push("/profile")}
      />

      <Modal
        visible={editingUsername}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingUsername(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={modalStyles.overlay}
        >
          <Pressable
            style={modalStyles.backdrop}
            onPress={() => setEditingUsername(false)}
          />
          <View style={[modalStyles.card, { backgroundColor: colors.surfaceElevated }]}>
            <Text style={[modalStyles.title, { color: colors.text }]}>Edit Username</Text>
            <TextInput
              style={[
                modalStyles.input,
                {
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={draftUsername}
              onChangeText={setDraftUsername}
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={saveUsername}
            />
            <View style={modalStyles.actions}>
              <Pressable
                style={modalStyles.cancel}
                onPress={() => setEditingUsername(false)}
              >
                <Text style={modalStyles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={modalStyles.save} onPress={saveUsername}>
                <Text style={modalStyles.saveText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Delete Account — Step 1: Warning */}
      <Modal
        visible={deleteStep === 1}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteStep(0)}
      >
        <View style={modalStyles.overlay}>
          <Pressable
            style={modalStyles.backdrop}
            onPress={() => setDeleteStep(0)}
          />
          <View style={[modalStyles.card, { backgroundColor: colors.surfaceElevated }]}>
            <Text style={[modalStyles.title, { color: colors.text }]}>Delete Account?</Text>
            <Text style={[modalStyles.body, { color: colors.textMuted }]}>
              This will permanently delete your account and all associated data.
              This action cannot be undone.
            </Text>
            <View style={modalStyles.actions}>
              <Pressable
                style={modalStyles.cancel}
                onPress={() => setDeleteStep(0)}
              >
                <Text style={modalStyles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={modalStyles.deleteBtn}
                onPress={() => {
                  setDeleteConfirmText("");
                  setDeleteStep(2);
                }}
              >
                <Text style={modalStyles.saveText}>Continue</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account — Step 2: Type DELETE */}
      <Modal
        visible={deleteStep === 2}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteStep(0)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={modalStyles.overlay}
        >
          <Pressable
            style={modalStyles.backdrop}
            onPress={() => setDeleteStep(0)}
          />
          <View style={[modalStyles.card, { backgroundColor: colors.surfaceElevated }]}>
            <Text style={[modalStyles.title, { color: colors.text }]}>Confirm Deletion</Text>
            <Text style={[modalStyles.body, { color: colors.textMuted }]}>
              Type{" "}
              <Text style={{ fontWeight: "700", color: "#E53935" }}>
                DELETE
              </Text>{" "}
              to permanently delete your account.
            </Text>
            <TextInput
              style={[
                modalStyles.input,
                {
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={deleteConfirmText}
              onChangeText={setDeleteConfirmText}
              autoFocus
              autoCapitalize="characters"
              autoCorrect={false}
              placeholder="Type DELETE"
              placeholderTextColor="#AAA"
            />
            <View style={modalStyles.actions}>
              <Pressable
                style={modalStyles.cancel}
                onPress={() => setDeleteStep(0)}
              >
                <Text style={modalStyles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  modalStyles.deleteBtn,
                  deleteConfirmText !== "DELETE" && modalStyles.disabledBtn,
                ]}
                onPress={deleteAccount}
                disabled={deleteConfirmText !== "DELETE"}
              >
                <Text style={modalStyles.saveText}>Delete Account</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <SettingsSection title="PREFERENCES">
          <SettingsRow
            icon={<Feather name="sun" size={18} color={SETTINGS_COLORS.icon} />}
            label="Dark Mode"
            onToggle={setDarkMode}
            showChevron={false}
            value={isDark}
          />
          <SettingsRow
            icon={
              <Ionicons
                name="notifications"
                size={17}
                color={SETTINGS_COLORS.icon}
              />
            }
            label="Notifications"
            onPress={() => router.push("/settings/notifications")}
          />
        </SettingsSection>

        <SettingsSection title="SUPPORT">
          <SettingsRow
            icon={
              <Feather
                name="help-circle"
                size={18}
                color={SETTINGS_COLORS.icon}
              />
            }
            label="Help & Feedback"
            onPress={() => router.push("/settings/help-feedback")}
          />
          <SettingsRow
            icon={
              <Feather name="info" size={18} color={SETTINGS_COLORS.icon} />
            }
            label="About"
            onPress={() => router.push("/settings/about")}
          />
        </SettingsSection>

        <SettingsSection title="ACCOUNT">
          <SettingsRow
            destructive
            icon={
              <Feather name="trash-2" size={18} color={SETTINGS_COLORS.red} />
            }
            label="Delete Account"
            onPress={() => setDeleteStep(1)}
          />
          <SettingsRow
            destructive
            icon={
              <MaterialCommunityIcons
                name="logout"
                size={18}
                color={SETTINGS_COLORS.red}
              />
            }
            label="Logout"
            onPress={confirmLogout}
          />
        </SettingsSection>
      </ScrollView>
    </View>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  card: {
    width: "85%",
    maxWidth: 360,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 15,
    color: "#1A1A1A",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancel: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cancelText: {
    color: "#888",
    fontWeight: "500",
  },
  save: {
    backgroundColor: "#75B399",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
  },
  body: {
    fontSize: 13,
    color: "#555",
    lineHeight: 19,
  },
  deleteBtn: {
    backgroundColor: "#E53935",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  disabledBtn: {
    opacity: 0.4,
  },
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: SETTINGS_COLORS.background,
  },
  content: {
    paddingHorizontal: 14,
    paddingTop: 20,
    paddingBottom: 24,
  },
});
