import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/src/theme/app-theme";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const REASONS = ["Spam", "Harassment", "Misinformation", "Other"] as const;
type ReportReason = (typeof REASONS)[number];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: ReportReason, details: string) => void;
}

export default function ReportModal({ visible, onClose, onSubmit }: Props) {
  const { colors } = useAppTheme();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [selected, setSelected] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState("");

  useEffect(() => {
    if (visible) {
      setSelected(null);
      setDetails("");
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(SCREEN_HEIGHT);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const handleSubmit = () => {
    if (!selected) {
      Alert.alert("Select a reason", "Please choose why you're reporting this insight.");
      return;
    }
    onSubmit(selected, details.trim());
    handleClose();
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.sheet,
                  { backgroundColor: colors.surfaceElevated },
                  { transform: [{ translateY: slideAnim }] },
                ]}
              >
                <ScrollView bounces={false} keyboardShouldPersistTaps="handled">
                  <Text style={[styles.title, { color: colors.text }]}>Report Insight</Text>
                  <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                    Why are you reporting this?
                  </Text>

                  <View style={styles.reasons}>
                    {REASONS.map((reason) => {
                      const active = selected === reason;
                      return (
                        <TouchableOpacity
                          key={reason}
                          style={[
                            styles.reasonChip,
                            { borderColor: colors.border },
                            active && styles.reasonChipActive,
                          ]}
                          onPress={() => setSelected(reason)}
                        >
                          <Ionicons
                            name={active ? "radio-button-on" : "radio-button-off"}
                            size={18}
                            color={active ? "#527AAF" : colors.textMuted}
                          />
                          <Text
                            style={[
                              styles.reasonText,
                              { color: active ? "#527AAF" : colors.text },
                            ]}
                          >
                            {reason}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <TextInput
                    style={[
                      styles.detailsInput,
                      { backgroundColor: colors.input, color: colors.text, borderColor: colors.border },
                    ]}
                    placeholder="Additional details (optional)"
                    placeholderTextColor={colors.textMuted}
                    value={details}
                    onChangeText={setDetails}
                    multiline
                    maxLength={280}
                  />

                  <View style={styles.buttons}>
                    <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
                      <Text style={[styles.cancelText, { color: colors.textMuted }]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.submitBtn, !selected && styles.submitBtnDisabled]}
                      onPress={handleSubmit}
                    >
                      <Text style={styles.submitText}>Submit Report</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 36,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  reasons: {
    gap: 8,
  },
  reasonChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  reasonChipActive: {
    borderColor: "#527AAF",
    backgroundColor: "#EDF3F8",
  },
  reasonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  detailsInput: {
    marginTop: 14,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    fontSize: 13,
    minHeight: 72,
    textAlignVertical: "top",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 16,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "600",
  },
  submitBtn: {
    backgroundColor: "#C65A43",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
