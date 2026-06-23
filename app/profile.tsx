import { Feather, FontAwesome5 } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { DeleteAccountModal } from "@/components/profile/delete-account-modal";
import { ProfileDetailRow } from "@/components/profile/profile-detail-row";
import { ProfileEditorModal } from "@/components/profile/profile-editor-modal";
import { ProfileHeader } from "@/components/profile/profile-header";
import { EditableProfileField } from "@/components/profile/profile-types";
import { useProfile } from "@/components/profile/use-profile";
import { SETTINGS_COLORS } from "@/components/settings/settings-theme";

export default function ProfileScreen() {
  const { deleteAccount, profile, updateProfile } = useProfile();
  const [editing, setEditing] = useState<EditableProfileField | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (event.type === "set" && selectedDate) {
      updateProfile("dob", selectedDate.toISOString().slice(0, 10));
    }
  };

  const currentDate = new Date(`${profile.dob}T00:00:00`);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ProfileHeader
        email={profile.email}
        name={profile.name}
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>PERSONAL DETAILS</Text>

        <ProfileDetailRow
          icon={<Feather name="user" size={18} color={SETTINGS_COLORS.icon} />}
          label="Full Name"
          onPress={() => setEditing("name")}
          value={profile.name}
        />
        <ProfileDetailRow
          icon={
            <FontAwesome5
              name="venus-mars"
              size={16}
              color={SETTINGS_COLORS.icon}
            />
          }
          label="Gender"
          onPress={() => setEditing("gender")}
          value={profile.gender}
        />
        <ProfileDetailRow
          icon={
            <Feather
              name="calendar"
              size={17}
              color={SETTINGS_COLORS.icon}
            />
          }
          label="Date of Birth"
          onPress={() => setShowDatePicker(true)}
          value={profile.dob}
        />
        {showDatePicker && (
          <View style={styles.datePicker}>
            <DateTimePicker
              display={Platform.OS === "ios" ? "inline" : "default"}
              maximumDate={new Date()}
              mode="date"
              onChange={handleDateChange}
              value={
                Number.isNaN(currentDate.getTime()) ? new Date() : currentDate
              }
            />
            {Platform.OS === "ios" && (
              <TouchableOpacity
                onPress={() => setShowDatePicker(false)}
                style={styles.dateDoneButton}
              >
                <Text style={styles.dateDoneText}>Done</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <Text style={[styles.sectionTitle, styles.accountTitle]}>ACCOUNT</Text>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setDeleteModalVisible(true)}
          style={styles.deleteRow}
        >
          <View style={styles.deleteIcon}>
            <Feather name="trash-2" size={18} color={SETTINGS_COLORS.red} />
          </View>
          <Text style={styles.deleteLabel}>Delete Account</Text>
          <Feather name="chevron-right" size={19} color="#989898" />
        </TouchableOpacity>
      </ScrollView>

      <ProfileEditorModal
        field={editing}
        onCancel={() => setEditing(null)}
        onSave={(value) => {
          if (editing) updateProfile(editing, value);
          setEditing(null);
        }}
        value={editing ? profile[editing] : ""}
      />

      <DeleteAccountModal
        onClose={() => setDeleteModalVisible(false)}
        onDelete={deleteAccount}
        visible={deleteModalVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: SETTINGS_COLORS.background,
  },
  content: {
    paddingHorizontal: 14,
    paddingTop: 24,
    paddingBottom: 36,
  },
  sectionTitle: {
    marginBottom: 8,
    marginLeft: 2,
    color: "#828282",
    fontSize: 11,
    fontWeight: "700",
  },
  accountTitle: {
    marginTop: 14,
  },
  deleteRow: {
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
  deleteIcon: {
    width: 30,
    height: 30,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF0F1",
  },
  deleteLabel: {
    flex: 1,
    marginLeft: 12,
    color: SETTINGS_COLORS.red,
    fontSize: 14,
    fontWeight: "600",
  },
  datePicker: {
    marginBottom: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: SETTINGS_COLORS.card,
  },
  dateDoneButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: SETTINGS_COLORS.blue,
  },
  dateDoneText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
