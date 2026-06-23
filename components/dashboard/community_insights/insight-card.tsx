import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { MoreHorizontal, ThumbsDown, ThumbsUp } from "lucide-react-native";

import InsightMenu from "./insight-menu";
import { Insight } from "./types";
import { useAppTheme } from "@/src/theme/app-theme";

interface Props {
  insight: Insight;
  isOwner: boolean;
  onReact: (type: "like" | "dislike") => void;
  onDelete: () => void;
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  const mins = Math.floor(seconds / 60);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
}

export default function InsightCard({
  insight,
  isOwner,
  onReact,
  onDelete,
}: Props) {
  const { colors } = useAppTheme();
  const { username, avatar_url } = insight.profiles;
  const liked = insight.userReaction === "like";
  const disliked = insight.userReaction === "dislike";

  const [menuOpen, setMenuOpen] = useState(false);

  const handleDelete = () => {
    setMenuOpen(false);
    Alert.alert("Delete insight", "Are you sure you want to delete this?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: onDelete,
      },
    ]);
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      {avatar_url ? (
        <Image source={{ uri: avatar_url }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Text style={styles.avatarInitial}>
            {(username ?? "?").charAt(0).toUpperCase()}
          </Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{username}</Text>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>{insight.category}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => setMenuOpen(true)}>
            <MoreHorizontal size={18} color={colors.text} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.message, { color: colors.text }]}>{insight.content}</Text>

        <Text style={[styles.meta, { color: colors.textMuted }]}>
          Route: {insight.route} • {timeAgo(insight.created_at)}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => onReact("like")}
          >
            <ThumbsUp size={18} color={liked ? colors.accent : colors.text} />
            <Text style={[{ color: colors.text }, liked && styles.activeCount]}>
              {insight.likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => onReact("dislike")}
          >
            <ThumbsDown size={18} color={disliked ? colors.danger : colors.text} />
            <Text style={[{ color: colors.text }, disliked && styles.activeDislike]}>
              {insight.dislikes}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <InsightMenu
        visible={menuOpen}
        isOwner={isOwner}
        onClose={() => setMenuOpen(false)}
        onDelete={handleDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 12,
    marginHorizontal: 12,
    marginTop: 8,
    backgroundColor: "#FFF",
    borderRadius: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  avatarPlaceholder: {
    backgroundColor: "#74AFA0",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarInitial: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
  },

  content: {
    flex: 1,
    marginLeft: 10,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },

  name: {
    fontWeight: "600",
    color: "#74AFA0",
  },

  badge: {
    backgroundColor: "#74AFA0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },

  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "600",
  },

  message: {
    marginTop: 4,
    fontSize: 13,
  },

  meta: {
    marginTop: 4,
    color: "#777",
    fontSize: 11,
  },

  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },

  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  activeCount: {
    color: "#74AFA0",
    fontWeight: "600",
  },

  activeDislike: {
    color: "#E57373",
    fontWeight: "600",
  },
});
