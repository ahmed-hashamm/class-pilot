// import { createClient } from "@/lib/supabase/server";
// import { redirect } from "next/navigation";
// import { Card, CardContent } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   AlertCircle,
//   Clock,
//   Inbox,
//   Calendar as CalendarIcon,
//   ChevronLeft,
//   CheckCircle2,
//   BadgeCheck,
//   Users,
// } from "lucide-react";
// import { format, isPast, isFuture } from "date-fns";
// import Link from "next/link";

// export default async function TodoPage() {
//   const supabase = await createClient();
//   const { data: { user } } = await supabase.auth.getUser();
//   if (!user) redirect("/login");

//   // FIX: Destructure { data } explicitly to avoid the .map() error
//   const { data: classMembersData } = await supabase
//   .from("class_members")
//   .select("class_id")
//   .eq("user_id", user.id);

// const { data: groupMembersData } = await supabase
//   .from("project_members")
//   .select("project_id")
//   .eq("user_id", user.id);


// const classIds = classMembersData?.map((cm) => cm.class_id) || [];
// const myGroupIds = groupMembersData?.map((gm) => gm.project_id) || [];

//   // Fetch assignments with group awareness
//   const { data: assignmentsData } = classIds.length > 0
//     ? await supabase
//         .from("assignments")
//         .select(`
//           id, 
//           title, 
//           due_date, 
//           points, 
//           is_group_project,
//           classes(name),
//           submissions!left(
//             status, 
//             final_grade, 
//             user_id, 
//             group_id
//           )
//         `)
//         .in("class_id", classIds)
//         .order("due_date", { ascending: true })
//     : { data: [] };

//   const allAssignments = assignmentsData || [];

//   // Logic: An assignment is "Done" if a submission exists for ME or MY GROUP
//   const done = allAssignments.filter((a: any) => {
//     if (!a.submissions || a.submissions.length === 0) return false;
//     return a.submissions.some((sub: any) => 
//       a.is_group_project 
//         ? myGroupIds.includes(sub.group_id) 
//         : sub.user_id === user.id
//     );
//   });

//   const notDone = allAssignments.filter((a: any) => 
//     !done.find((d: any) => d.id === a.id)
//   );

//   const missing = notDone.filter((a: any) => isPast(new Date(a.due_date)));
//   const assigned = notDone.filter((a: any) => isFuture(new Date(a.due_date)));

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-8">
//       <Link href="/dashboard" className="flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors gap-1 w-fit">
//         <ChevronLeft size={16} /> Back to Dashboard
//       </Link>

//       <header>
//         <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Assignments</h1>
//         <p className="text-slate-500 text-sm">Track your team and individual progress.</p>
//       </header>
      
//       <Tabs defaultValue="assigned" className="w-full">
//         <TabsList className="grid w-full grid-cols-3 max-w-[500px] mb-8 bg-slate-100/50 p-1">
//           <TabsTrigger value="assigned" className="flex gap-2">Assigned <Badge count={assigned.length} color="bg-slate-200 text-slate-700" /></TabsTrigger>
//           <TabsTrigger value="missing" className="flex gap-2">Missing <Badge count={missing.length} color="bg-red-100 text-red-600" /></TabsTrigger>
//           <TabsTrigger value="done" className="flex gap-2">Done <Badge count={done.length} color="bg-green-100 text-green-700" /></TabsTrigger>
//         </TabsList>

//         <TabsContent value="assigned" className="space-y-4 outline-none">
//           {assigned.length === 0 ? <EmptyState icon={<Inbox size={40} />} title="All caught up!" description="No upcoming deadlines." /> : 
//             assigned.map((a: any) => <TodoItem key={a.id} assignment={a} status="assigned" userId={user.id} myGroupIds={myGroupIds} />)}
//         </TabsContent>

//         <TabsContent value="missing" className="space-y-4 outline-none">
//           {missing.length === 0 ? <EmptyState icon={<CheckCircle2 size={40} />} title="Nothing missing" description="Great job!" /> : 
//             missing.map((a: any) => <TodoItem key={a.id} assignment={a} status="missing" userId={user.id} myGroupIds={myGroupIds} />)}
//         </TabsContent>

//         <TabsContent value="done" className="space-y-4 outline-none">
//           {done.length === 0 ? <EmptyState icon={<Inbox size={40} />} title="No work yet" description="Submit an assignment to see it here." /> : 
//             done.map((a: any) => <TodoItem key={a.id} assignment={a} status="done" userId={user.id} myGroupIds={myGroupIds} />)}
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

// // --- SUB-COMPONENTS ---

// function TodoItem({ assignment, status, userId, myGroupIds }: any) {
//   // Find the relevant submission (either mine or my group's)
//   const submission = assignment.submissions?.find((sub: any) => 
//     assignment.is_group_project ? myGroupIds.includes(sub.group_id) : sub.user_id === userId
//   );

//   const subStatus = submission?.status;
//   const grade = submission?.final_grade;

//   const getStatusUI = () => {
//     if (status === "missing") return { color: "bg-red-500", label: "Overdue", theme: "text-red-600 bg-red-50" };
//     if (status === "assigned") return { color: "bg-indigo-500", label: "Upcoming", theme: "text-indigo-600 bg-indigo-50" };
//     return { color: "bg-emerald-500", label: subStatus === "graded" ? "Graded" : "Turned In", theme: "text-emerald-700 bg-emerald-50" };
//   };

//   const ui = getStatusUI();

//   return (
//     <Card className="overflow-hidden border-slate-200 hover:border-indigo-200 transition-all">
//       <div className="flex">
//         <div className={`w-1.5 ${ui.color}`} />
//         <div className="p-5 flex flex-1 items-center justify-between">
//           <div className="space-y-1">
//             <div className="flex items-center gap-2">
//               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{assignment.classes?.name}</span>
//               {assignment.is_group_project && (
//                 <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 rounded uppercase">
//                   <Users size={10} /> Group
//                 </span>
//               )}
//             </div>
//             <h3 className="font-bold text-slate-800">{assignment.title}</h3>
//             <div className="text-xs text-slate-500 flex items-center gap-1">
//               <CalendarIcon size={12} /> Due {format(new Date(assignment.due_date), "MMM d, yyyy")}
//             </div>
//           </div>

//           <div className="flex flex-col items-end gap-2">
//             <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${ui.theme}`}>{ui.label}</div>
//             {(grade !== undefined || status === "missing") && (
//               <div className="text-right">
//                 <span className="text-lg font-black">{status === "missing" ? 0 : grade}</span>
//                 <span className="text-[10px] font-bold text-slate-400"> / {assignment.points}</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// }

// function Badge({ count, color }: { count: number; color: string }) {
//   if (count === 0) return null;
//   return <span className={`${color} px-1.5 py-0.5 rounded text-[10px] font-bold`}>{count}</span>;
// }

// function EmptyState({ icon, title, description }: any) {
//   return (
//     <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-100 rounded-3xl text-center">
//       <div className="text-slate-200 mb-2">{icon}</div>
//       <h3 className="font-bold text-slate-800">{title}</h3>
//       <p className="text-sm text-slate-400">{description}</p>
//     </div>
//   );
// }
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  CheckCircle2, Inbox, Calendar as CalendarIcon,
  ChevronLeft, Users, Clock, AlertCircle,
} from "lucide-react";
import { format, isPast, isFuture } from "date-fns";
import Link from "next/link";

export default async function TodoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: classMembersData } = await supabase
    .from("class_members").select("class_id").eq("user_id", user.id);

  const { data: groupMembersData } = await supabase
    .from("project_members").select("project_id").eq("user_id", user.id);

    const classIds   = classMembersData?.map((cm: { class_id: string }) => cm.class_id) || [];
    const myGroupIds = groupMembersData?.map((gm: { project_id: string }) => gm.project_id) || [];

  const { data: assignmentsData } = classIds.length > 0
    ? await supabase
        .from("assignments")
        .select(`
          id, title, due_date, points, is_group_project,
          classes(name),
          submissions!left(status, final_grade, user_id, group_id)
        `)
        .in("class_id", classIds)
        .order("due_date", { ascending: true })
    : { data: [] };

  const allAssignments = assignmentsData || [];

  const done = allAssignments.filter((a: any) => {
    if (!a.submissions?.length) return false;
    return a.submissions.some((sub: any) =>
      a.is_group_project ? myGroupIds.includes(sub.group_id) : sub.user_id === user.id
    );
  });

  const notDone    = allAssignments.filter((a: any) => !done.find((d: any) => d.id === a.id));
  const missing    = notDone.filter((a: any) => isPast(new Date(a.due_date)));
  const assigned   = notDone.filter((a: any) => isFuture(new Date(a.due_date)));

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-8">

      {/* Back */}
      <Link href="/dashboard"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold
          text-muted-foreground hover:text-navy transition-colors w-fit">
        <ChevronLeft size={15} /> Back to dashboard
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-navy flex items-center justify-center">
          <CheckCircle2 size={17} className="text-yellow" />
        </div>
        <div>
          <h1 className="font-black text-[20px] tracking-tight">My assignments</h1>
          <p className="text-[13px] text-muted-foreground">
            Track your individual and team progress.
          </p>
        </div>
      </div>

      {/* Summary pills */}
      <div className="flex gap-3 flex-wrap">
        <SummaryPill label="Assigned" count={assigned.length} variant="navy" />
        <SummaryPill label="Missing"  count={missing.length}  variant="red" />
        <SummaryPill label="Done"     count={done.length}     variant="green" />
      </div>

      {/* Tabs implemented as anchor sections */}
      <Section
        title="Assigned"
        icon={<Clock size={14} />}
        items={assigned}
        emptyIcon={<Inbox size={24} />}
        emptyTitle="All caught up!"
        emptyDesc="No upcoming deadlines."
        status="assigned"
        userId={user.id}
        myGroupIds={myGroupIds}
      />

      {missing.length > 0 && (
        <Section
          title="Missing"
          icon={<AlertCircle size={14} />}
          items={missing}
          emptyIcon={<CheckCircle2 size={24} />}
          emptyTitle="Nothing missing"
          emptyDesc="Great job!"
          status="missing"
          userId={user.id}
          myGroupIds={myGroupIds}
        />
      )}

      <Section
        title="Done"
        icon={<CheckCircle2 size={14} />}
        items={done}
        emptyIcon={<Inbox size={24} />}
        emptyTitle="No completed work yet"
        emptyDesc="Submit an assignment to see it here."
        status="done"
        userId={user.id}
        myGroupIds={myGroupIds}
      />
    </div>
  );
}

/* ── Section ── */
function Section({ title, icon, items, emptyIcon, emptyTitle, emptyDesc, status, userId, myGroupIds }: any) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[11px] font-bold tracking-[.18em] uppercase text-navy
        flex items-center gap-1.5">
        {icon} {title} · {items.length}
      </p>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12
          border-2 border-dashed border-border rounded-2xl bg-white text-center">
          <div className="text-muted-foreground/30">{emptyIcon}</div>
          <p className="font-bold text-[14px]">{emptyTitle}</p>
          <p className="text-[13px] text-muted-foreground">{emptyDesc}</p>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          {items.map((a: any, i: number) => (
            <TodoItem
              key={a.id}
              assignment={a}
              status={status}
              userId={userId}
              myGroupIds={myGroupIds}
              isLast={i === items.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Todo item ── */
function TodoItem({ assignment, status, userId, myGroupIds, isLast }: any) {
  const submission = assignment.submissions?.find((sub: any) =>
    assignment.is_group_project ? myGroupIds.includes(sub.group_id) : sub.user_id === userId
  );
  const grade     = submission?.final_grade;
  const isGraded  = submission?.status === "graded";
  const isMissing = status === "missing";
  const isDone    = status === "done";

  const accentBar = isMissing ? "bg-red-500" : isDone ? "bg-green-500" : "bg-navy";

  const statusPill = isMissing
    ? "bg-red-50 text-red-600 border-red-200"
    : isDone && isGraded
    ? "bg-green-50 text-green-700 border-green-200"
    : isDone
    ? "bg-yellow/20 text-navy border-yellow/40"
    : "bg-navy/8 text-navy border-navy/15";

  const statusLabel = isMissing ? "Overdue"
    : isDone && isGraded ? "Graded"
    : isDone ? "Turned in"
    : "Upcoming";

  return (
    <div className={`flex items-stretch
      ${!isLast ? "border-b border-border" : ""}`}>

      {/* Accent bar */}
      <div className={`w-1 shrink-0 ${accentBar}`} />

      <div className="flex flex-1 items-center justify-between gap-4 px-5 py-4">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-widest
              text-muted-foreground">
              {assignment.classes?.name}
            </span>
            {assignment.is_group_project && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold
                bg-yellow/15 text-navy border border-yellow/30 rounded-full px-2 py-0.5">
                <Users size={9} /> Group
              </span>
            )}
          </div>
          <p className="font-bold text-[14px] text-foreground truncate">
            {assignment.title}
          </p>
          <p className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <CalendarIcon size={11} />
            Due {format(new Date(assignment.due_date), "MMM d, yyyy")}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={`text-[10px] font-bold uppercase tracking-wide
            border rounded-full px-2.5 py-0.5 ${statusPill}`}>
            {statusLabel}
          </span>
          {(grade != null || isMissing) && (
            <p className="text-right">
              <span className="font-black text-[16px]">
                {isMissing ? 0 : grade}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {" "}/ {assignment.points}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Summary pill ── */
function SummaryPill({ label, count, variant }: { label: string; count: number; variant: string }) {
  const styles: Record<string, string> = {
    navy:  "bg-navy/8 text-navy border-navy/15",
    red:   "bg-red-50 text-red-600 border-red-200",
    green: "bg-green-50 text-green-700 border-green-200",
  };
  return (
    <div className={`inline-flex items-center gap-2 border rounded-xl px-4 py-2
      text-[13px] font-semibold ${styles[variant]}`}>
      {label}
      <span className="font-black text-[15px]">{count}</span>
    </div>
  );
}