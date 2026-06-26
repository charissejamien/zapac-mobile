import { supabaseAdmin } from "@/lib/supabase";
import UserGrowthChart from "@/components/charts/user-growth-chart";

export const dynamic = "force-dynamic";

async function getUserGrowth() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("created_at")
    .gte("created_at", thirtyDaysAgo)
    .order("created_at", { ascending: true });

  if (!profiles || profiles.length === 0) return [];

  const counts: Record<string, number> = {};
  for (const p of profiles) {
    const date = new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    counts[date] = (counts[date] ?? 0) + 1;
  }

  return Object.entries(counts).map(([date, users]) => ({ date, users }));
}

async function getActiveUsers() {
  const ranges = [
    { label: "24h", ms: 24 * 60 * 60 * 1000 },
    { label: "7d", ms: 7 * 24 * 60 * 60 * 1000 },
    { label: "30d", ms: 30 * 24 * 60 * 60 * 1000 },
  ];

  const results = await Promise.all(
    ranges.map(async ({ label, ms }) => {
      const since = new Date(Date.now() - ms).toISOString();
      const { data } = await supabaseAdmin
        .from("screen_views")
        .select("user_id")
        .gte("entered_at", since);

      const unique = new Set(data?.map((d) => d.user_id) ?? []);
      return { label, count: unique.size };
    })
  );

  return results;
}

export default async function UserAnalyticsPage() {
  const [growthData, activeUsers] = await Promise.all([getUserGrowth(), getActiveUsers()]);

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-gray-900">User Analytics</h2>
      <p className="text-sm text-gray-400 mt-1">User growth and activity patterns</p>

      <div className="grid grid-cols-3 gap-4 mt-6">
        {activeUsers.map(({ label, count }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Active ({label})</p>
            <p className="text-3xl font-extrabold text-accent mt-1">{count}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        {growthData.length > 0 ? (
          <UserGrowthChart data={growthData} />
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
            No new user signups in the last 30 days
          </div>
        )}
      </div>
    </div>
  );
}
