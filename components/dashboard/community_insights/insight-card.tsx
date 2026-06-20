import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  AlertTriangle,
  Coins,
  MapPin,
  MoreHorizontal,
  Route,
  Star,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react-native";

import InsightMenu from "./insight-menu";
import { Insight } from "./types";

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

export default function InsightCard({
  insight,
  isOwner,
  onReact,
  onDelete,
}: Props) {
  const { username, avatar_url } = insight.profiles;
  const liked = insight.userReaction === "like";
  const disliked = insight.userReaction === "dislike";
  const categoryStyle = CATEGORY_STYLES[insight.category];
  const CategoryIcon = categoryStyle.icon;

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
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.authorRow}>
          {avatar_url ? (
            <Image source={{ uri: avatar_url }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>
                {(username ?? "?").charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          <View style={styles.authorCopy}>
            <Text style={styles.name}>{username || "Anonymous commuter"}</Text>
            <Text style={styles.timestamp}>{timeAgo(insight.created_at)}</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setMenuOpen(true)}
          style={styles.menuButton}
        >
          <MoreHorizontal size={19} color="#657384" />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.badge,
          { backgroundColor: categoryStyle.backgroundColor },
        ]}
      >
        <CategoryIcon size={12} color={categoryStyle.color} />
        <Text style={[styles.badgeText, { color: categoryStyle.color }]}>
          {insight.category}
        </Text>
      </View>

      <Text style={styles.message}>{insight.content}</Text>

      <View style={styles.routeRow}>
        <MapPin size={13} color="#718096" />
        <Text style={styles.routeText} numberOfLines={2}>
          {insight.route}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.actions}>
        <TouchableOpacity
          activeOpacity={0.75}
          style={[styles.actionItem, liked && styles.likeActive]}
          onPress={() => onReact("like")}
        >
          <ThumbsUp size={16} color={liked ? "#397968" : "#657384"} />
          <Text style={[styles.actionText, liked && styles.activeCount]}>
            Helpful · {insight.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          style={[styles.actionItem, disliked && styles.dislikeActive]}
          onPress={() => onReact("dislike")}
        >
          <ThumbsDown size={16} color={disliked ? "#C65A43" : "#657384"} />
          <Text style={[styles.actionText, disliked && styles.activeDislike]}>
            Not helpful · {insight.dislikes}
          </Text>
        </TouchableOpacity>
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
    padding: 14,
    marginHorizontal: 16,
    marginTop: 9,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6EBEF",
    elevation: 1,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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

  authorCopy: {
    flex: 1,
    marginLeft: 10,
  },

  name: {
    fontSize: 13,
    fontWeight: "800",
    color: "#26354A",
  },

  timestamp: {
    color: "#909BA8",
    fontSize: 10,
    marginTop: 2,
  },

  menuButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    marginLeft: 8,
  },

  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 13,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: "800",
  },

  message: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: "#344255",
  },

  routeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 12,
  },

  routeText: {
    flex: 1,
    color: "#718096",
    fontSize: 11,
    lineHeight: 16,
  },

  divider: {
    height: 1,
    backgroundColor: "#EDF1F4",
    marginTop: 13,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 11,
  },

  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    minHeight: 30,
    paddingHorizontal: 8,
    borderRadius: 15,
    backgroundColor: "transparent",
  },

  likeActive: {
    backgroundColor: "#E7F2EF",
  },

  dislikeActive: {
    backgroundColor: "#FFF0EC",
  },

  actionText: {
    color: "#657384",
    fontSize: 10,
    fontWeight: "700",
  },

  activeCount: {
    color: "#397968",
  },

  activeDislike: {
    color: "#C65A43",
  },
});
