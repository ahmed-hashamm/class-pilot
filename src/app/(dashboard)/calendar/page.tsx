// import { createClient } from "@/lib/supabase/server";
// import { redirect } from "next/navigation";
// import { Calendar as CalendarIcon, ChevronLeft } from "lucide-react";
// import CalenderView from "@/components/dashboard/CalenderView";
// import Link from "next/link";

// export default async function CalendarPage() {
//   const supabase = await createClient();
//   const { data: { user } } = await supabase.auth.getUser();
//   if (!user) redirect("/login");

//   // 1. Fetch Class IDs the user belongs to
//   const { data: classMembers } = await supabase
//     .from("class_members")
//     .select("class_id")
//     .eq("user_id", user.id);

//   const classIds = classMembers?.map((cm: any) => cm.class_id) || [];

//   // 2. Fetch Group IDs the user belongs to
//   const { data: groupMembers } = await supabase
//     .from("project_members")
//     .select("project_id")
//     .eq("user_id", user.id);

//   const myGroupIds = groupMembers?.map((gm: any) => gm.project_id) || [];

//   // 3. Fetch Assignments
//   const { data: assignments } = classIds.length > 0
//     ? await supabase
//         .from("assignments")
//         .select(`
//           id, 
//           title, 
//           due_date, 
//           points, 
//           is_group_project,
//           classes(name,id),
//           submissions!left(status, user_id, group_id)
//         `)
//         .in("class_id", classIds)
//         .not("due_date", "is", null)
//     : { data: [] };

//   // 4. Prepare clean list for the Calendar with Group logic
//   const assignmentList = (assignments || []).map((a: any) => {
//     // Check if there is a submission that matches:
//     // - The current user's ID (Individual)
//     // - OR the user's group ID (Group Project)
//     const hasSubmission = a.submissions?.some((s: any) => 
//       s.user_id === user.id || (a.is_group_project && myGroupIds.includes(s.group_id))
//     );

//     return {
//       id: a.id,
//       title: a.title,
//       due_date: a.due_date,
//       points: a.points,
//       classes: a.classes,
//       isDone: !!hasSubmission // true if either team or user submitted
//     };
//   });

//   return (
//     <div className="max-w-7xl mx-auto space-y-8 p-6">
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <Link href="/dashboard" className="flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors gap-1">
//           <ChevronLeft size={16} /> Back to Dashboard
//         </Link>
//         <div className="flex gap-3">
//           <StatCard icon={<CalendarIcon size={18} />} label="Total Tasks" value={assignmentList.length} color="blue" />
//         </div>
//       </div>

//       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-1">
//         <CalenderView assignments={assignmentList} />
//       </div>
//     </div>
//   );
// }

// // ... StatCard remains the same
// function StatCard({
//   icon,
//   label,
//   value,
//   color,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: number;
//   color: string;
// }) {
//   const colors: any = {
//     blue: "bg-blue-50 text-blue-700 border-blue-100",
//     green: "bg-emerald-50 text-emerald-700 border-emerald-100",
//   };
//   return (
//     <div
//       className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${colors[color]}`}
//     >
//       <div className="p-2 bg-white  rounded-lg shadow-sm">{icon}</div>
//       <div className="flex gap-2 items-center">
//         <p className="text-[10px] uppercase  font-bold tracking-wider opacity-70">
//           {label}
//         </p>
//         <p className="text-xl font-bold leading-none">{value}</p>
//       </div>
//     </div>
//   );
// }

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Calendar as CalendarIcon, ChevronLeft, CheckCircle2, Clock } from "lucide-react";
import CalenderView from "@/components/dashboard/CalenderView";
import Link from "next/link";

export default async function CalendarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: classMembers } = await supabase
    .from("class_members").select("class_id").eq("user_id", user.id);

  const { data: groupMembers } = await supabase
    .from("project_members").select("project_id").eq("user_id", user.id);

  const classIds   = classMembers?.map((cm: any) => cm.class_id) || [];
  const myGroupIds = groupMembers?.map((gm: any) => gm.project_id) || [];

  const { data: assignments } = classIds.length > 0
    ? await supabase
        .from("assignments")
        .select(`
          id, title, due_date, points, is_group_project,
          classes(name, id),
          submissions!left(status, user_id, group_id)
        `)
        .in("class_id", classIds)
        .not("due_date", "is", null)
    : { data: [] };

  const assignmentList = (assignments || []).map((a: any) => {
    const hasSubmission = a.submissions?.some((s: any) =>
      s.user_id === user.id || (a.is_group_project && myGroupIds.includes(s.group_id))
    );
    return {
      id:       a.id,
      title:    a.title,
      due_date: a.due_date,
      points:   a.points,
      classes:  a.classes,
      isDone:   !!hasSubmission,
    };
  });

  const totalDone    = assignmentList.filter((a) => a.isDone).length;
  const totalPending = assignmentList.filter((a) => !a.isDone).length;

  return (
    <div className="w-full max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-8 flex flex-col gap-8">

      {/* Top bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/dashboard"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold
            text-muted-foreground hover:text-navy transition-colors w-fit">
          <ChevronLeft size={15} /> Back to dashboard
        </Link>

        {/* Stats */}
        <div className="flex gap-3 flex-wrap">
          <StatPill
            icon={<CalendarIcon size={13} />}
            label="Total"
            value={assignmentList.length}
            variant="navy"
          />
          <StatPill
            icon={<Clock size={13} />}
            label="Pending"
            value={totalPending}
            variant="yellow"
          />
          <StatPill
            icon={<CheckCircle2 size={13} />}
            label="Done"
            value={totalDone}
            variant="green"
          />
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <CalenderView assignments={assignmentList} />
      </div>
    </div>
  );
}

/* ── Stat pill ── */
function StatPill({
  icon, label, value, variant,
}: {
  icon: React.ReactNode
  label: string
  value: number
  variant: "navy" | "yellow" | "green"
}) {
  const styles: Record<string, string> = {
    navy:   "bg-navy/8 text-navy border-navy/15",
    yellow: "bg-yellow/20 text-navy border-yellow/40",
    green:  "bg-green-50 text-green-700 border-green-200",
  };
  return (
    <div className={`inline-flex items-center gap-2.5 border rounded-xl px-4 py-2.5
      text-[13px] font-semibold ${styles[variant]}`}>
      {icon}
      <span className="text-[12px] font-bold uppercase tracking-wide opacity-70">
        {label}
      </span>
      <span className="font-black text-[16px] leading-none">{value}</span>
    </div>
  );
}
