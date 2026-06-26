import { notFound, redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getReport(id: string) {
  const { data: report } = await supabaseAdmin
    .from("reported_insights")
    .select("*")
    .eq("id", id)
    .single();

  if (!report) return null;

  const [{ data: insight }, { data: reporter }] = await Promise.all([
    supabaseAdmin
      .from("community_insights")
      .select("id, content, category, route, user_id, created_at, profiles(username, avatar_url, email)")
      .eq("id", report.insight_id)
      .single(),
    supabaseAdmin
      .from("profiles")
      .select("id, username, email")
      .eq("id", report.reported_by)
      .single(),
  ]);

  return { ...report, insight, reporter };
}

async function handleAction(formData: FormData) {
  "use server";

  const reportId = formData.get("reportId") as string;
  const action = formData.get("action") as string;
  const insightId = formData.get("insightId") as string;

  if (action === "dismiss") {
    await supabaseAdmin
      .from("reported_insights")
      .update({ status: "dismissed" })
      .eq("id", reportId);
  } else if (action === "delete_insight") {
    await supabaseAdmin.from("community_insights").delete().eq("id", insightId);
    await supabaseAdmin
      .from("reported_insights")
      .update({ status: "reviewed" })
      .eq("id", reportId);
  } else if (action === "mark_reviewed") {
    await supabaseAdmin
      .from("reported_insights")
      .update({ status: "reviewed" })
      .eq("id", reportId);
  }

  redirect("/reports");
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await getReport(id);

  if (!report) return notFound();

  const insight = report.insight as any;
  const reporter = report.reporter as any;
  const isPending = report.status === "pending";

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-extrabold text-gray-900">Report Detail</h2>
      <p className="text-sm text-gray-400 mt-1">
        Reported on {new Date(report.created_at).toLocaleString()}
      </p>

      <div className="mt-6 space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Report Info
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Reason</p>
              <p className="font-semibold text-danger mt-0.5">{report.reason}</p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-semibold capitalize mt-0.5">{report.status}</p>
            </div>
            <div>
              <p className="text-gray-500">Reported By</p>
              <p className="font-medium mt-0.5">{reporter?.username ?? reporter?.email ?? "Unknown"}</p>
            </div>
            {report.details && (
              <div className="col-span-2">
                <p className="text-gray-500">Additional Details</p>
                <p className="mt-0.5 text-gray-700">{report.details}</p>
              </div>
            )}
          </div>
        </div>

        {insight ? (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Reported Insight
            </h3>
            <div className="text-sm space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-blue-50 text-primary text-xs font-semibold px-2 py-0.5 rounded">
                  {insight.category}
                </span>
                <span className="text-gray-400 text-xs">
                  by {insight.profiles?.username ?? "Unknown"}
                </span>
              </div>
              <p className="text-gray-800">{insight.content}</p>
              <p className="text-xs text-gray-400">Route: {insight.route}</p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 text-center text-gray-400">
            Insight has been deleted
          </div>
        )}

        {isPending && (
          <div className="flex gap-3 pt-2">
            <form action={handleAction}>
              <input type="hidden" name="reportId" value={report.id} />
              <input type="hidden" name="insightId" value={insight?.id ?? ""} />
              <input type="hidden" name="action" value="dismiss" />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Dismiss Report
              </button>
            </form>

            <form action={handleAction}>
              <input type="hidden" name="reportId" value={report.id} />
              <input type="hidden" name="insightId" value={insight?.id ?? ""} />
              <input type="hidden" name="action" value="mark_reviewed" />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                Mark Reviewed
              </button>
            </form>

            {insight && (
              <form action={handleAction}>
                <input type="hidden" name="reportId" value={report.id} />
                <input type="hidden" name="insightId" value={insight.id} />
                <input type="hidden" name="action" value="delete_insight" />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-danger text-white hover:bg-danger/90 transition-colors"
                >
                  Delete Insight
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
