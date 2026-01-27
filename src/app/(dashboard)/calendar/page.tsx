import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Calendar as CalendarIcon, ChevronLeft } from "lucide-react";
import CalenderView from "@/components/dashboard/CalenderView";
import Link from "next/link";

export default async function CalendarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 1. Fetch Class IDs the user belongs to
  const { data: classMembers } = await supabase
    .from("class_members")
    .select("class_id")
    .eq("user_id", user.id);

  const classIds = classMembers?.map((cm: any) => cm.class_id) || [];

  // 2. Fetch Group IDs the user belongs to
  const { data: groupMembers } = await supabase
    .from("project_members")
    .select("project_id")
    .eq("user_id", user.id);

  const myGroupIds = groupMembers?.map((gm: any) => gm.project_id) || [];

  // 3. Fetch Assignments
  const { data: assignments } = classIds.length > 0
    ? await supabase
        .from("assignments")
        .select(`
          id, 
          title, 
          due_date, 
          points, 
          is_group_project,
          classes(name,id),
          submissions!left(status, user_id, group_id)
        `)
        .in("class_id", classIds)
        .not("due_date", "is", null)
    : { data: [] };

  // 4. Prepare clean list for the Calendar with Group logic
  const assignmentList = (assignments || []).map((a: any) => {
    // Check if there is a submission that matches:
    // - The current user's ID (Individual)
    // - OR the user's group ID (Group Project)
    const hasSubmission = a.submissions?.some((s: any) => 
      s.user_id === user.id || (a.is_group_project && myGroupIds.includes(s.group_id))
    );

    return {
      id: a.id,
      title: a.title,
      due_date: a.due_date,
      points: a.points,
      classes: a.classes,
      isDone: !!hasSubmission // true if either team or user submitted
    };
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Link href="/dashboard" className="flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors gap-1">
          <ChevronLeft size={16} /> Back to Dashboard
        </Link>
        <div className="flex gap-3">
          <StatCard icon={<CalendarIcon size={18} />} label="Total Tasks" value={assignmentList.length} color="blue" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-1">
        <CalenderView assignments={assignmentList} />
      </div>
    </div>
  );
}

// ... StatCard remains the same
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
  };
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${colors[color]}`}
    >
      <div className="p-2 bg-white  rounded-lg shadow-sm">{icon}</div>
      <div className="flex gap-2 items-center">
        <p className="text-[10px] uppercase  font-bold tracking-wider opacity-70">
          {label}
        </p>
        <p className="text-xl font-bold leading-none">{value}</p>
      </div>
    </div>
  );
}
