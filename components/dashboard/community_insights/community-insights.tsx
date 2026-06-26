import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { HeartHandshake, MessageCircleMore, ShieldCheck } from "lucide-react-native";

import { supabase } from "@/src/lib/supabase";
import { useAppTheme } from "@/src/theme/app-theme";

import FilterCarousel from "./filter-carousel";
import InsightCard from "./insight-card";
import InsightFAB from "./insight-fab";
import NewInsightModal from "./new-insight-modal";
import { Insight } from "./types";

export interface CommunityInsightsRef {
  refresh: () => void;
}

const CommunityInsights = forwardRef<CommunityInsightsRef>((_props, ref) => {
  const { colors } = useAppTheme();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("All");
  const [showNewInsight, setShowNewInsight] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAtFeedEnd, setIsAtFeedEnd] = useState(false);

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
    setLoading(false);
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

  const handleReport = async (insightId: string, reason: string, details: string) => {
    if (!userId) return;

    const { error } = await supabase.from("reported_insights").insert({
      insight_id: insightId,
      reported_by: userId,
      reason,
      details: details || null,
    });

    if (error) {
      Alert.alert("Error", "Could not submit report. Please try again.");
    } else {
      Alert.alert("Report Submitted", "Thank you — we'll review this insight shortly.");
    }
  };

  const filteredInsights =
    selected === "All"
      ? insights
      : insights.filter((item) => item.category === selected);

  useEffect(() => {
    setIsAtFeedEnd(false);
  }, [selected, filteredInsights.length]);

  return (
    <View style={styles.content}>
      <FilterCarousel selected={selected} onSelect={setSelected} />

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#74AFA0" />
          <Text style={[styles.loaderTitle, { color: colors.text }]}>
            Gathering the latest road notes
          </Text>
          <Text style={[styles.loaderText, { color: colors.textMuted }]}>
            One moment—we&apos;re checking what fellow commuters shared.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredInsights}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          scrollIndicatorInsets={{ bottom: 128 }}
          scrollEventThrottle={16}
          onScroll={({ nativeEvent }) => {
            const { contentOffset, contentSize, layoutMeasurement } =
              nativeEvent;
            const isScrollable =
              contentSize.height > layoutMeasurement.height + 24;
            const reachedEnd =
              contentOffset.y + layoutMeasurement.height >=
              contentSize.height - 20;

            setIsAtFeedEnd(isScrollable && reachedEnd);
          }}
          ListHeaderComponent={
            <View>
              <View
                style={[
                  styles.welcomeCard,
                  { backgroundColor: colors.primarySoft },
                ]}
              >
                <View style={styles.welcomeIcon}>
                  <HeartHandshake size={20} color="#527AAF" />
                </View>
                <View style={styles.welcomeCopy}>
                  <Text style={[styles.welcomeTitle, { color: colors.text }]}>
                    A little local help goes a long way
                  </Text>
                  <Text
                    style={[styles.welcomeText, { color: colors.textMuted }]}
                  >
                    See what others noticed, or share a quick update to make
                    someone else&apos;s trip less stressful.
                  </Text>
                </View>
              </View>

              <View style={styles.feedHeader}>
                <View style={styles.feedSummary}>
                  <View>
                    <Text style={[styles.feedTitle, { color: colors.text }]}>
                      What commuters are saying
                    </Text>
                    <Text
                      style={[styles.feedSubtitle, { color: colors.textMuted }]}
                    >
                      Recent, community-shared updates
                    </Text>
                  </View>
                  <View style={styles.insightCountBadge}>
                    <Text style={styles.insightCountText}>
                      {filteredInsights.length}
                    </Text>
                  </View>
                </View>
                <View style={styles.kindnessNote}>
                  <ShieldCheck size={12} color="#397968" />
                  <Text style={styles.kindnessText}>
                    Use updates as a helpful guide and stay aware on the road.
                  </Text>
                </View>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <MessageCircleMore size={25} color="#527AAF" />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                It&apos;s quiet here for now
              </Text>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                If you&apos;re already on this route, a small update from you
                could make another commuter feel more prepared.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <InsightCard
              insight={item}
              isOwner={item.user_id === userId}
              onReact={(type) => handleReact(item.id, type)}
              onDelete={() => handleDelete(item.id)}
              onReport={(reason, details) => handleReport(item.id, reason, details)}
            />
          )}
        />
      )}

      <InsightFAB
        hidden={isAtFeedEnd}
        onPress={() => setShowNewInsight(true)}
      />

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
  welcomeCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 18,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 10,
  },
  welcomeIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    marginRight: 11,
  },
  welcomeCopy: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  welcomeText: {
    fontSize: 11,
    lineHeight: 17,
    marginTop: 3,
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
    color: "#527AAF",
    fontSize: 11,
    fontWeight: "800",
  },
  insightCountBadge: {
    minWidth: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EDF3F8",
  },
  kindnessNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 9,
  },
  kindnessText: {
    flex: 1,
    color: "#5C7B72",
    fontSize: 9,
    lineHeight: 13,
  },

  loader: {
    alignItems: "center",
    marginTop: 54,
    paddingHorizontal: 36,
  },
  loaderTitle: {
    fontSize: 14,
    fontWeight: "800",
    marginTop: 14,
  },

  loaderText: {
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    marginTop: 5,
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
