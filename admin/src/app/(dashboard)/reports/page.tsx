import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getReports(status: string) {
  let query = supabaseAdmin
    .from("reported_insights")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data: reports } = await query;
  if (!reports || reports.length === 0) return [];

  const insightIds = [...new Set(reports.map((r: any) => r.insight_id))];
  const reporterIds = [...new Set(reports.map((r: any) => r.reported_by))];

  const [{ data: insights }, { data: reporters }] = await Promise.all([
    supabaseAdmin.from("community_insights").select("id, content, category, route, user_id, created_at, profiles(username)").in("id", insightIds),
    supabaseAdmin.from("profiles").select("id, username, email").in("id", reporterIds),
  ]);

  const insightMap = Object.fromEntries((insights ?? []).map((i: any) => [i.id, i]));
  const reporterMap = Object.fromEntries((reporters ?? []).map((r: any) => [r.id, r]));

  return reports.map((report: any) => ({
    ...report,
    insight: insightMap[report.insight_id] ?? null,
    reporter: reporterMap[report.reported_by] ?? null,
  }));
}

const STATUS_BADGES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  reviewed: "bg-green-100 text-green-800",
  dismissed: "bg-gray-100 text-gray-600",
};

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const status = params.status ?? "all";
  const reports = await getReports(status);

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-gray-900">Reported Insights</h2>
      <p className="text-sm text-gray-400 mt-1">Review reports submitted by users</p>

      <div className="flex gap-2 mt-4">
        {["all", "pending", "reviewed", "dismissed"].map((s) => (
          <Link
            key={s}
            href={`/reports?status=${s}`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              status === s
                ? "bg-primary text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Insight</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Reason</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Reported By</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reports.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                  No reports found
                </td>
              </tr>
            )}
            {reports.map((report: any) => (
              <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 max-w-xs">
                  <p className="truncate font-medium text-gray-900">
                    {report.insight?.content ?? "Deleted insight"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{report.insight?.category}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-block bg-red-50 text-danger text-xs font-semibold px-2 py-1 rounded-md">
                    {report.reason}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {report.reporter?.username ?? report.reporter?.email ?? "Unknown"}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-md capitalize ${STATUS_BADGES[report.status]}`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {new Date(report.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/reports/${report.id}`}
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
