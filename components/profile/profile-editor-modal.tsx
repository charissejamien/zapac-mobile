import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { EditableProfileField } from "@/components/profile/profile-types";
import { SETTINGS_COLORS } from "@/components/settings/settings-theme";
import { useAppTheme } from "@/src/theme/app-theme";

const GENDER_OPTIONS = ["Female", "Male", "Prefer not to say"];

type ProfileEditorModalProps = {
  field: EditableProfileField | null;
  onCancel: () => void;
  onSave: (value: string) => void;
  value: string;
};

export function ProfileEditorModal({
  field,
  onCancel,
  onSave,
  value,
}: ProfileEditorModalProps) {
  const { colors } = useAppTheme();
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [field, value]);

  return (
    <Modal
      animationType="fade"
      onRequestClose={onCancel}
      transparent
      visible={field !== null}
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
        <View style={[styles.card, { backgroundColor: colors.surfaceElevated }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            Edit {field === "gender" ? "Gender" : "Full Name"}
          </Text>

          {field === "gender" ? (
            <View style={styles.genderOptions}>
              {GENDER_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setDraft(option)}
                  style={[
                    styles.genderOption,
                    { borderColor: colors.border },
                    draft === option && styles.genderOptionSelected,
                    draft === option && {
                      backgroundColor: colors.primarySoft,
                      borderColor: colors.primary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.genderText,
                      { color: colors.text },
                      draft === option && styles.genderTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <TextInput
              autoFocus
              onChangeText={setDraft}
              style={[
                styles.input,
                {
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={draft}
            />
          )}

          <View style={styles.actions}>
            <TouchableOpacity onPress={onCancel} style={styles.cancel}>
              <Text style={[styles.cancelText, { color: colors.textMuted }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!draft.trim()}
              onPress={() => onSave(draft.trim())}
              style={[
                styles.save,
                { backgroundColor: colors.primary },
                !draft.trim() && styles.disabled,
              ]}
            >
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    paddingHorizontal: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.42)",
  },
  card: {
    width: "100%",
    padding: 22,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  title: {
    marginBottom: 18,
    color: SETTINGS_COLORS.text,
    fontSize: 19,
    fontWeight: "700",
  },
  input: {
    height: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#D8DFE8",
    borderRadius: 10,
    color: SETTINGS_COLORS.text,
    fontSize: 15,
  },
  genderOptions: {
    gap: 8,
  },
  genderOption: {
    padding: 13,
    borderWidth: 1,
    borderColor: "#D8DFE8",
    borderRadius: 10,
  },
  genderOptionSelected: {
    borderColor: SETTINGS_COLORS.blue,
    backgroundColor: SETTINGS_COLORS.iconBackground,
  },
  genderText: {
    color: SETTINGS_COLORS.text,
    fontSize: 14,
  },
  genderTextSelected: {
    color: SETTINGS_COLORS.blue,
    fontWeight: "600",
  },
  actions: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancel: {
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  cancelText: {
    color: SETTINGS_COLORS.mutedText,
    fontWeight: "600",
  },
  save: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 9,
    backgroundColor: SETTINGS_COLORS.blue,
  },
  saveText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.4,
  },
});
