import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { supabase } from "@/src/lib/supabase";
import { useAppTheme } from "@/src/theme/app-theme";

const SCREEN_HEIGHT =
  Dimensions.get("window").height;

const CATEGORY_KEYWORDS: Record<
  string,
  string[]
> = {
  Warning: [
    "traffic",
    "accident",
    "flood",
    "avoid",
    "danger",
    "hazard",
    "closed",
    "ingon",
    "baha",
    "peligro",
    "likay",
  ],
  Shortcuts: [
    "shortcut",
    "side street",
    "alley",
    "cut through",
    "alternate",
    "lugas",
    "dapit",
    "likuan",
  ],
  "Fare Tips": [
    "fare",
    "price",
    "discount",
    "cheaper",
    "pesos",
    "bayad",
    "singkwenta",
    "sukli",
    "plete",
  ],
  "Driver Reviews": [
    "driver",
    "kuya",
    "manong",
    "rude",
    "nice",
    "rating",
    "review",
    "bastos",
    "buotan",
  ],
};

function detectCategory(
  text: string
): "Warning" | "Shortcuts" | "Fare Tips" | "Driver Reviews" {
  const lower = text.toLowerCase();

  let best: string = "Warning";
  let bestCount = 0;

  for (const [category, keywords] of Object.entries(
    CATEGORY_KEYWORDS
  )) {
    const count = keywords.filter((kw) =>
      lower.includes(kw)
    ).length;
    if (count > bestCount) {
      bestCount = count;
      best = category;
    }
  }

  return best as any;
}

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function NewInsightModal({
  visible,
  onClose,
}: Props) {
  const { colors } = useAppTheme();
  const [content, setContent] = useState("");
  const [route, setRoute] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] =
    useState<string | null>(null);

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

  useEffect(() => {
    if (!visible) return;

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user.id)
        .single();

      if (data) {
        setUsername(data.username ?? "");
        setAvatarUrl(data.avatar_url ?? null);
      }
    })();
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleSubmit = async () => {
    if (!content.trim() || !route.trim())
      return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("community_insights")
      .insert({
        user_id: user.id,
        category: detectCategory(
          content.trim()
        ),
        route: route.trim(),
        content: content.trim(),
      });

    setContent("");
    setRoute("");
    handleClose();
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
          <KeyboardAvoidingView
            behavior={
              Platform.OS === "ios"
                ? "padding"
                : undefined
            }
            style={styles.bottomArea}
          >
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.card,
                  { backgroundColor: colors.surfaceElevated },
                  {
                    transform: [
                      {
                        translateY: slideAnim,
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.userRow}>
                  {avatarUrl ? (
                    <Image
                      source={{
                        uri: avatarUrl,
                      }}
                      style={styles.avatar}
                    />
                  ) : (
                    <View
                      style={[
                        styles.avatar,
                        styles.avatarPlaceholder,
                      ]}
                    >
                      <Text
                        style={
                          styles.avatarInitial
                        }
                      >
                        {username
                          .charAt(0)
                          .toUpperCase()}
                      </Text>
                    </View>
                  )}

                  <View>
                    <Text style={[styles.name, { color: colors.text }]}>
                      {username}
                    </Text>

                    <Text
                      style={[styles.subtitle, { color: colors.textMuted }]}
                    >
                      Posting publicly across
                      ZAPAC
                    </Text>
                  </View>
                </View>

                <TextInput
                  style={[styles.contentInput, { color: colors.text }]}
                  placeholder="Share an insight to the community...."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  value={content}
                  onChangeText={setContent}
                />

                <View
                  style={[styles.routeWrapper, { borderColor: colors.border, backgroundColor: colors.input }]}
                >
                  <TextInput
                    style={[styles.routeInput, { color: colors.text }]}
                    placeholder="What route are you on?"
                    placeholderTextColor={colors.textMuted}
                    value={route}
                    onChangeText={setRoute}
                  />
                </View>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                >
                  <Text
                    style={styles.submitText}
                  >
                    OK
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  bottomArea: {
    width: "100%",
  },

  card: {
    width: "100%",
    backgroundColor: "#FFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 40,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },

  avatarPlaceholder: {
    backgroundColor: "#74AFA0",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarInitial: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3D3D3D",
  },

  subtitle: {
    fontSize: 12,
    color: "#888",
  },

  contentInput: {
    width: "100%",
    minHeight: 100,
    fontSize: 14,
    color: "#333",
    textAlignVertical: "top",
    marginBottom: 16,
  },

  routeWrapper: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 16,
  },

  routeInput: {
    fontSize: 14,
    color: "#333",
    paddingVertical: 10,
  },

  submitButton: {
    width: "100%",
    backgroundColor: "#74AFA0",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  submitText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
