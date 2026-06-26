import { supabaseAdmin } from "@/lib/supabase";
import ScreenChart from "@/components/charts/screen-chart";

export const dynamic = "force-dynamic";

async function getScreenStats() {
  const { data: views } = await supabaseAdmin
    .from("screen_views")
    .select("screen_name, duration_seconds");

  if (!views || views.length === 0) return [];

  const stats: Record<string, { views: number; totalDuration: number }> = {};
  for (const v of views) {
    if (!stats[v.screen_name]) {
      stats[v.screen_name] = { views: 0, totalDuration: 0 };
    }
    stats[v.screen_name].views++;
    stats[v.screen_name].totalDuration += v.duration_seconds ?? 0;
  }

  return Object.entries(stats)
    .map(([screen_name, s]) => ({
      screen_name,
      views: s.views,
      avg_duration: Math.round(s.totalDuration / s.views),
    }))
    .sort((a, b) => b.views - a.views);
}

export default async function ScreenAnalyticsPage() {
  const screenStats = await getScreenStats();

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-gray-900">Screen Analytics</h2>
      <p className="text-sm text-gray-400 mt-1">Which screens users visit most</p>

      <div className="mt-6">
        {screenStats.length > 0 ? (
          <ScreenChart data={screenStats} />
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
            No screen view data yet. Data will appear once users start using the app with tracking enabled.
          </div>
        )}
      </div>

      {screenStats.length > 0 && (
        <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Screen</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Total Views</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Avg Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {screenStats.map((s) => (
                <tr key={s.screen_name} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{s.screen_name}</td>
                  <td className="px-4 py-3 text-gray-600">{s.views}</td>
                  <td className="px-4 py-3 text-gray-600">{s.avg_duration}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
