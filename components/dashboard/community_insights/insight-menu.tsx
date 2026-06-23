import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/src/theme/app-theme";

const SCREEN_HEIGHT =
  Dimensions.get("window").height;

interface Props {
  visible: boolean;
  isOwner: boolean;
  onClose: () => void;
  onDelete?: () => void;
}

export default function InsightMenu({
  visible,
  isOwner,
  onClose,
  onDelete,
}: Props) {
  const { colors } = useAppTheme();
  const slideAnim = useRef(
    new Animated.Value(SCREEN_HEIGHT)
  ).current;

  useEffect(() => {
    if (visible) {
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback
        onPress={handleClose}
      >
        <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.sheet,
                { backgroundColor: colors.surfaceElevated },
                {
                  transform: [
                    { translateY: slideAnim },
                  ],
                },
              ]}
            >
              <Text style={[styles.title, { color: colors.textMuted }]}>
                More Options
              </Text>

              <TouchableOpacity
                style={styles.item}
                onPress={handleClose}
              >
                <Ionicons
                  name="arrow-redo-outline"
                  size={20}
                  color={colors.text}
                />
                <Text style={[styles.itemText, { color: colors.text }]}>
                  Share
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.item}
                onPress={handleClose}
              >
                <Ionicons
                  name="flag-outline"
                  size={20}
                  color={colors.text}
                />
                <Text style={[styles.itemText, { color: colors.text }]}>
                  Report
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.item}
                onPress={handleClose}
              >
                <Ionicons
                  name="download-outline"
                  size={20}
                  color={colors.text}
                />
                <Text style={[styles.itemText, { color: colors.text }]}>
                  Save
                </Text>
              </TouchableOpacity>

              {isOwner && (
                <TouchableOpacity
                  style={styles.item}
                  onPress={onDelete}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color="#E53935"
                  />
                  <Text
                    style={styles.deleteText}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 36,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 13,
    color: "#999",
    marginBottom: 12,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 14,
  },

  itemText: {
    fontSize: 16,
    color: "#333",
  },

  deleteText: {
    fontSize: 16,
    color: "#E53935",
    fontWeight: "600",
  },
});
