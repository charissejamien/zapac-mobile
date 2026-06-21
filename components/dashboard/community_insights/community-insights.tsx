import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

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
        <ActivityIndicator style={styles.loader} size="large" color="#74AFA0" />
      ) : (
        <FlatList
          data={filteredInsights}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
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
  loader: {
    marginTop: 32,
  },
  listContainer: {
    paddingTop: 4,
    paddingBottom: 120,
  },
});
