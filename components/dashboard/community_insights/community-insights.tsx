import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { MessageCircleMore } from "lucide-react-native";

import { supabase } from "@/src/lib/supabase";

import FilterCarousel from "./filter-carousel";
import InsightCard from "./insight-card";
import InsightFAB from "./insight-fab";
import NewInsightModal from "./new-insight-modal";
import { Insight } from "./types";

export interface CommunityInsightsRef {
  refresh: () => void;
}

const CommunityInsights = forwardRef<CommunityInsightsRef>((_props, ref) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("All");
  const [showNewInsight, setShowNewInsight] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  const fetchInsights = useCallback(async () => {
    const { data: rows } = await supabase
      .from("community_insights")
      .select("*, profiles(username, avatar_url)")
      .order("created_at", {
        ascending: false,
      });

    if (!rows) {
      setLoading(false);
      return;
    }

    if (rows.length === 0) {
      setInsights([]);
      setLoading(false);
      return;
    }

    const ids = rows.map((r: any) => r.id);

    const { data: allReactions } = await supabase
      .from("insight_reactions")
      .select("insight_id, reaction, user_id")
      .in("insight_id", ids);

    const likeCounts: Record<string, number> = {};
    const dislikeCounts: Record<string, number> = {};
    const userReactions: Record<string, string> = {};

    for (const r of allReactions ?? []) {
      if (r.reaction === "like") {
        likeCounts[r.insight_id] = (likeCounts[r.insight_id] ?? 0) + 1;
      } else {
        dislikeCounts[r.insight_id] = (dislikeCounts[r.insight_id] ?? 0) + 1;
      }
      if (r.user_id === userId) {
        userReactions[r.insight_id] = r.reaction;
      }
    }

    const merged: Insight[] = rows.map((row: any) => ({
      ...row,
      likes: likeCounts[row.id] ?? 0,
      dislikes: dislikeCounts[row.id] ?? 0,
      userReaction: (userReactions[row.id] as "like" | "dislike") ?? null,
    }));

    setInsights(merged);
    text: setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (userId) fetchInsights();
  }, [userId, fetchInsights]);

  useImperativeHandle(ref, () => ({
    refresh: fetchInsights,
  }));

  const handleReact = async (insightId: string, type: "like" | "dislike") => {
    if (!userId) return;

    const insight = insights.find((i) => i.id === insightId);
    if (!insight) return;

    if (insight.userReaction === type) {
      await supabase
        .from("insight_reactions")
        .delete()
        .eq("insight_id", insightId)
        .eq("user_id", userId);
    } else {
      await supabase.from("insight_reactions").upsert(
        {
          insight_id: insightId,
          user_id: userId,
          reaction: type,
        },
        {
          onConflict: "insight_id,user_id",
        },
      );
    }

    await fetchInsights();
  };

  const handleDelete = async (insightId: string) => {
    await supabase.from("community_insights").delete().eq("id", insightId);

    await fetchInsights();
  };

  const filteredInsights =
    selected === "All"
      ? insights
      : insights.filter((item) => item.category === selected);

  return (
    <View style={styles.content}>
      <FilterCarousel selected={selected} onSelect={setSelected} />

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#74AFA0" />
          <Text style={styles.loaderText}>Loading community updates...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredInsights}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          scrollIndicatorInsets={{ bottom: 128 }}
          ListHeaderComponent={
            <View style={styles.feedHeader}>
              <View style={styles.feedSummary}>
                <Text style={styles.feedTitle}>Community Insights</Text>
                <Text style={styles.insightCountText}>
                  {filteredInsights.length}{" "}
                  {filteredInsights.length === 1 ? "post" : "posts"}
                </Text>
              </View>
              <Text style={styles.feedSubtitle}>
                Updates shared by Cebu commuters.
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <MessageCircleMore size={25} color="#527AAF" />
              </View>
              <Text style={styles.emptyTitle}>No insights here yet</Text>
              <Text style={styles.emptyText}>
                Be the first to share a helpful update for this category.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <InsightCard
              insight={item}
              isOwner={item.user_id === userId}
              onReact={(type) => handleReact(item.id, type)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
        />
      )}

      <InsightFAB onPress={() => setShowNewInsight(true)} />

      <NewInsightModal
        visible={showNewInsight}
        onClose={() => {
          setShowNewInsight(false);
          fetchInsights();
        }}
      />
    </View>
  );
});

CommunityInsights.displayName = "CommunityInsights";
export default CommunityInsights;

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },

  list: {
    flex: 1,
  },

  listContent: {
    paddingBottom: 148,
    paddingTop: 2,
  },

  feedHeader: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
  },

  feedSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  feedTitle: {
    color: "#26354A",
    fontSize: 17,
    fontWeight: "700",
  },

  feedSubtitle: {
    color: "#7A8795",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },

  insightCountText: {
    color: "#8A96A5",
    fontSize: 11,
  },

  loader: {
    alignItems: "center",
    marginTop: 48,
  },

  loaderText: {
    color: "#718096",
    fontSize: 12,
    marginTop: 12,
  },

  emptyState: {
    alignItems: "center",
    marginHorizontal: 24,
    marginTop: 42,
  },

  emptyIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EDF3F8",
  },

  emptyTitle: {
    color: "#26354A",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 14,
  },

  emptyText: {
    color: "#7A8795",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 5,
  },
  listContainer: {
    paddingTop: 4,
    paddingBottom: 120,
  },
});
