import { supabaseAdmin } from "@/lib/supabase";
import StatsCard from "@/components/stats-card";

async function getStats() {
  const [
    { count: totalUsers },
    { count: totalInsights },
    { count: pendingReports },
    { count: activeToday },
  ] = await Promise.all([
    supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("community_insights").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("reported_insights").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabaseAdmin
      .from("screen_views")
      .select("user_id", { count: "exact", head: true })
      .gte("entered_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
  ]);

  return {
    totalUsers: totalUsers ?? 0,
    totalInsights: totalInsights ?? 0,
    pendingReports: pendingReports ?? 0,
    activeToday: activeToday ?? 0,
  };
}

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-gray-900">Dashboard</h2>
      <p className="text-sm text-gray-400 mt-1">Overview of Zapac app activity</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatsCard title="Total Users" value={stats.totalUsers} />
        <StatsCard title="Total Insights" value={stats.totalInsights} />
        <StatsCard
          title="Pending Reports"
          value={stats.pendingReports}
          color={stats.pendingReports > 0 ? "text-danger" : "text-primary"}
        />
        <StatsCard title="Active Today" value={stats.activeToday} subtitle="Unique users in last 24h" />
      </div>
    </div>
  );
}
