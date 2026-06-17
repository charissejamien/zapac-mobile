import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import InsightMenu from "./insight-menu";
import { Insight } from "./types";

interface Props {
  insight: Insight;

  menuVisible: boolean;

  onMenuToggle: () => void;
}

export default function InsightCard({
  insight,
  menuVisible,
  onMenuToggle,
}: Props) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: insight.avatar }}
        style={styles.avatar}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>
            {insight.userName}
          </Text>

          <View>
            <TouchableOpacity
              onPress={onMenuToggle}
            >
              <Ionicons
                name="ellipsis-horizontal"
                size={18}
                color="#000"
              />
            </TouchableOpacity>

            <InsightMenu
              visible={menuVisible}
            />
          </View>
        </View>

        <Text style={styles.message}>
          {insight.content}
        </Text>

        <Text style={styles.meta}>
          Route: {insight.route} •{" "}
          {insight.timeAgo}
        </Text>

      <View style={styles.actions}>
        <View style={styles.actionItem}>
          <Ionicons
            name="thumbs-up-outline"
            size={18}
          />
          <Text>{insight.likes}</Text>
        </View>

        <View style={styles.actionItem}>
          <Ionicons
            name="thumbs-down-outline"
            size={18}
          />
          <Text>{insight.dislikes}</Text>
        </View>
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 12,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  content: {
    flex: 1,
    marginLeft: 10,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  name: {
    fontWeight: "600",
    color: "#74AFA0",
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
});