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
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import {
  AlertTriangle,
  Coins,
  MapPin,
  Route,
  Send,
  Star,
  X,
} from "lucide-react-native";

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

const CATEGORY_STYLES = {
  Warning: {
    backgroundColor: "#FFF0EC",
    color: "#C65A43",
    icon: AlertTriangle,
  },
  Shortcuts: {
    backgroundColor: "#EDF3F8",
    color: "#527AAF",
    icon: Route,
  },
  "Fare Tips": {
    backgroundColor: "#FFF4E2",
    color: "#A66A19",
    icon: Coins,
  },
  "Driver Reviews": {
    backgroundColor: "#E7F2EF",
    color: "#397968",
    icon: Star,
  },
} as const;

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
  const detectedCategory = detectCategory(content.trim());
  const categoryStyle = CATEGORY_STYLES[detectedCategory];
  const CategoryIcon = categoryStyle.icon;
  const canSubmit = content.trim().length > 0 && route.trim().length > 0;

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
  }, [slideAnim, visible]);

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
                <View style={styles.handle} />

                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.title}>Share an insight</Text>
                    <Text style={styles.description}>
                      Help other commuters on the road.
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={handleClose}
                    style={styles.closeButton}
                  >
                    <X size={20} color="#657384" />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.form}
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
                        <Text style={styles.avatarInitial}>
                          {(username || "?").charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}

                    <View style={styles.userCopy}>
                      <Text style={styles.name}>
                        {username || "ZAPAC commuter"}
                      </Text>
                      <Text style={styles.subtitle}>
                        Sharing publicly with the ZAPAC community
                      </Text>
                    </View>
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Route</Text>
                    <View style={styles.routeWrapper}>
                      <MapPin size={18} color="#527AAF" />
                      <TextInput
                        style={styles.routeInput}
                        placeholder="e.g. IT Park to Ayala"
                        placeholderTextColor="#98A2AE"
                        value={route}
                        onChangeText={setRoute}
                        returnKeyType="next"
                      />
                    </View>
                  </View>

                  <View style={styles.fieldGroup}>
                    <View style={styles.fieldHeading}>
                      <Text style={styles.fieldLabel}>Your insight</Text>
                      <Text style={styles.characterCount}>
                        {content.length}/280
                      </Text>
                    </View>
                    <View style={styles.contentWrapper}>
                      <TextInput
                        style={styles.contentInput}
                        placeholder="Share a fare tip, shortcut, warning, or driver experience..."
                        placeholderTextColor="#98A2AE"
                        multiline
                        maxLength={280}
                        value={content}
                        onChangeText={setContent}
                      />
                    </View>
                  </View>

                  <View style={styles.categoryRow}>
                    <Text style={styles.categoryLabel}>Category</Text>
                    <View
                      style={[
                        styles.categoryBadge,
                        { backgroundColor: categoryStyle.backgroundColor },
                      ]}
                    >
                      <CategoryIcon size={12} color={categoryStyle.color} />
                      <Text
                        style={[
                          styles.categoryBadgeText,
                          { color: categoryStyle.color },
                        ]}
                      >
                        {detectedCategory}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.82}
                    style={[
                      styles.submitButton,
                      !canSubmit && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={!canSubmit}
                  >
                    <Send size={17} color="#FFFFFF" />
                    <Text style={styles.submitText}>Share insight</Text>
                  </TouchableOpacity>
                </ScrollView>
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
    backgroundColor: "rgba(24, 37, 52, 0.48)",
    justifyContent: "flex-end",
  },

  bottomArea: {
    width: "100%",
    maxHeight: "92%",
  },

  card: {
    width: "100%",
    maxHeight: SCREEN_HEIGHT * 0.88,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 10,
    overflow: "hidden",
  },

  handle: {
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#CDD5DD",
    alignSelf: "center",
    marginBottom: 14,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },

  title: {
    color: "#26354A",
    fontSize: 20,
    fontWeight: "700",
  },

  description: {
    color: "#7A8795",
    fontSize: 11,
    marginTop: 3,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E9EEF3",
    marginLeft: 12,
  },

  form: {
    paddingHorizontal: 20,
    paddingBottom: 36,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 14,
  },

  avatarPlaceholder: {
    backgroundColor: "#74AFA0",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarInitial: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  userCopy: {
    flex: 1,
    marginLeft: 10,
  },

  name: {
    fontSize: 13,
    fontWeight: "700",
    color: "#26354A",
  },

  subtitle: {
    fontSize: 10,
    lineHeight: 14,
    color: "#8A96A5",
    marginTop: 2,
  },

  fieldGroup: {
    marginBottom: 16,
  },

  fieldHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  fieldLabel: {
    color: "#3F4C5C",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 7,
  },

  characterCount: {
    color: "#98A2AE",
    fontSize: 10,
    marginBottom: 7,
  },

  routeWrapper: {
    width: "100%",
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCE2E8",
    borderRadius: 12,
    paddingHorizontal: 14,
  },

  routeInput: {
    flex: 1,
    fontSize: 13,
    color: "#344255",
    paddingVertical: 13,
  },

  contentWrapper: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCE2E8",
    borderRadius: 12,
    paddingHorizontal: 14,
  },

  contentInput: {
    width: "100%",
    minHeight: 112,
    maxHeight: 160,
    fontSize: 13,
    lineHeight: 20,
    color: "#344255",
    textAlignVertical: "top",
    paddingVertical: 13,
  },

  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  categoryLabel: {
    color: "#657384",
    fontSize: 12,
    fontWeight: "600",
  },

  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  categoryBadgeText: {
    fontSize: 9,
    fontWeight: "700",
  },

  submitButton: {
    width: "100%",
    minHeight: 50,
    flexDirection: "row",
    backgroundColor: "#74AFA0",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderRadius: 16,
  },

  submitButtonDisabled: {
    backgroundColor: "#B9C7C3",
  },

  submitText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
