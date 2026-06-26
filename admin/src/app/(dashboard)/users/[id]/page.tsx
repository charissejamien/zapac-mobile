import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getUserDetail(id: string) {
  const [{ data: profile }, { data: insights }] = await Promise.all([
    supabaseAdmin.from("profiles").select("*").eq("id", id).single(),
    supabaseAdmin
      .from("community_insights")
      .select("id, content, category, route, created_at")
      .eq("user_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const insightIds = (insights ?? []).map((i) => i.id);
  let reports: any[] = [];

  if (insightIds.length > 0) {
    const { data } = await supabaseAdmin
      .from("reported_insights")
      .select("id, reason, status, created_at, insight_id")
      .in("insight_id", insightIds)
      .order("created_at", { ascending: false });
    reports = data ?? [];
  }

  return { profile, insights: insights ?? [], reports };
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { profile, insights, reports } = await getUserDetail(id);

  if (!profile) return notFound();

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-2xl object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-white text-2xl font-bold">
            {(profile.username ?? "?").charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">{profile.username ?? "Unknown"}</h2>
          <p className="text-sm text-gray-400">{profile.email}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Joined {new Date(profile.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Total Insights</p>
          <p className="text-3xl font-extrabold text-primary mt-1">{insights.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Reports Against</p>
          <p className={`text-3xl font-extrabold mt-1 ${reports.length > 0 ? "text-danger" : "text-gray-300"}`}>
            {reports.length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-600">Insights ({insights.length})</h3>
        </div>
        {insights.length === 0 ? (
          <p className="px-4 py-8 text-center text-gray-400 text-sm">No insights posted</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {insights.map((insight) => (
              <div key={insight.id} className="px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-50 text-primary text-xs font-semibold px-2 py-0.5 rounded">
                    {insight.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(insight.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-800">{insight.content}</p>
                <p className="text-xs text-gray-400 mt-1">Route: {insight.route}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {reports.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-600">Reports Against This User ({reports.length})</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {reports.map((report) => (
              <div key={report.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-danger bg-red-50 px-2 py-0.5 rounded">
                    {report.reason}
                  </span>
                  <span className="text-xs text-gray-400 ml-2 capitalize">{report.status}</span>
                </div>
                <span className="text-xs text-gray-400">{new Date(report.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
