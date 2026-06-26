import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getUsers() {
  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("id, username, email, avatar_url, created_at")
    .order("created_at", { ascending: false });

  if (!profiles) return [];

  const userIds = profiles.map((p) => p.id);

  const [{ data: insightRows }, { data: reportRows }] = await Promise.all([
    supabaseAdmin
      .from("community_insights")
      .select("id, user_id")
      .in("user_id", userIds),
    supabaseAdmin
      .from("reported_insights")
      .select("insight_id")
      .eq("status", "pending"),
  ]);

  const insightsPerUser: Record<string, number> = {};
  const insightOwner: Record<string, string> = {};
  for (const i of insightRows ?? []) {
    insightsPerUser[i.user_id] = (insightsPerUser[i.user_id] ?? 0) + 1;
    insightOwner[i.id] = i.user_id;
  }

  const reportsPerUser: Record<string, number> = {};
  for (const r of reportRows ?? []) {
    const uid = insightOwner[r.insight_id];
    if (uid) reportsPerUser[uid] = (reportsPerUser[uid] ?? 0) + 1;
  }

  return profiles.map((p) => ({
    ...p,
    insight_count: insightsPerUser[p.id] ?? 0,
    report_count: reportsPerUser[p.id] ?? 0,
  }));
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-gray-900">Users</h2>
      <p className="text-sm text-gray-400 mt-1">{users.length} registered users</p>

      <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">User</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Insights</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Reports</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Joined</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">
                        {(user.username ?? "?").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium text-gray-900">{user.username ?? "—"}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{user.email ?? "—"}</td>
                <td className="px-4 py-3 text-gray-600">{user.insight_count}</td>
                <td className="px-4 py-3">
                  {user.report_count > 0 ? (
                    <span className="text-danger font-semibold">{user.report_count}</span>
                  ) : (
                    <span className="text-gray-400">0</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/users/${user.id}`}
                    className="text-primary hover:underline text-xs font-medium"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
