import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SETTINGS_COLORS } from "@/components/settings/settings-theme";
import { useAppTheme } from "@/src/theme/app-theme";

type DeleteAccountModalProps = {
  onClose: () => void;
  onDelete: () => Promise<void>;
  visible: boolean;
};

export function DeleteAccountModal({
  onClose,
  onDelete,
  visible,
}: DeleteAccountModalProps) {
  const { colors } = useAppTheme();
  const [step, setStep] = useState<1 | 2>(1);
  const [confirmation, setConfirmation] = useState("");

  useEffect(() => {
    if (visible) {
      setStep(1);
      setConfirmation("");
    }
  }, [visible]);

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.overlay, { backgroundColor: colors.overlay }]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.card, { backgroundColor: colors.surfaceElevated }]}>
          {step === 1 ? (
            <>
              <View
                style={[
                  styles.warningIcon,
                  { backgroundColor: colors.dangerSoft },
                ]}
              >
                <Feather
                  name="trash-2"
                  size={22}
                  color={SETTINGS_COLORS.red}
                />
              </View>
              <Text style={[styles.title, { color: colors.text }]}>
                Delete Account?
              </Text>
              <Text style={[styles.body, { color: colors.textMuted }]}>
                This permanently deletes your account and all associated data.
                This action cannot be undone.
              </Text>
            </>
          ) : (
            <>
              <Text style={[styles.title, { color: colors.text }]}>
                Confirm Deletion
              </Text>
              <Text style={[styles.body, { color: colors.textMuted }]}>
                Type <Text style={styles.deleteWord}>DELETE</Text> to
                permanently delete your account.
              </Text>
              <TextInput
                autoCapitalize="characters"
                autoCorrect={false}
                autoFocus
                onChangeText={setConfirmation}
                placeholder="Type DELETE"
                placeholderTextColor="#AAAAAA"
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.input,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                value={confirmation}
              />
            </>
          )}

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.cancel}>
              <Text style={[styles.cancelText, { color: colors.textMuted }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={step === 2 && confirmation !== "DELETE"}
              onPress={() => {
                if (step === 1) {
                  setStep(2);
                } else {
                  void onDelete();
                }
              }}
              style={[
                styles.deleteButton,
                { backgroundColor: colors.danger },
                step === 2 &&
                  confirmation !== "DELETE" &&
                  styles.disabledButton,
              ]}
            >
              <Text style={styles.deleteButtonText}>
                {step === 1 ? "Continue" : "Delete Account"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  warningIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF0F1",
  },
  title: {
    marginBottom: 18,
    color: SETTINGS_COLORS.text,
    fontSize: 19,
    fontWeight: "700",
  },
  body: {
    color: "#555555",
    fontSize: 13,
    lineHeight: 19,
  },
  deleteWord: {
    color: SETTINGS_COLORS.red,
    fontWeight: "700",
  },
  input: {
    height: 48,
    marginTop: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#D8DFE8",
    borderRadius: 10,
    color: SETTINGS_COLORS.text,
    fontSize: 15,
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
  deleteButton: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 9,
    backgroundColor: SETTINGS_COLORS.red,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.4,
  },
});
