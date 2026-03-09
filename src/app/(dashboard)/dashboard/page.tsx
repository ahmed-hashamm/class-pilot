// // import { createClient } from "@/lib/supabase/server";
// // import Link from "next/link";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { format } from "date-fns";
// // import { Plus, Home, ListTodo, MoreVertical, Users } from "lucide-react";
// // import DashboardBanner from "@/components/dashboard/DashboardBanner";
// // import ClassCard from "@/components/dashboard/ClassCard";

// // export default async function DashboardPage() {
// //   const supabase = await createClient();
// //   const {
// //     data: { user },
// //   } = await supabase.auth.getUser();

// //   if (!user) {
// //     return null;
// //   }

// //   // Get user profile for greeting - check metadata first (for OAuth users), then database
// //   let userName =
// //     user.user_metadata?.full_name || user.user_metadata?.name || null;

// //   if (!userName) {
// //     const { data: userProfile, error } = await supabase
// //       .from("users")
// //       .select("full_name")
// //       .eq("id", user.id)
// //       .single();

// //     if (!error && userProfile) {
// //       userName = (userProfile as any)?.full_name;
// //     }
// //   }

// //   // Final fallback to email or 'User'
// //   userName = userName || user.email?.split("@")[0] || "User";

// //   // Get user's classes with member counts
// //   const { data: classMembers } = await supabase
// //   .from('class_members')
// //   .select(`
// //     id,
// //     role,
// //     class_id,
// //     joined_at,
// //     classes:classes (
// //       id,
// //       name
// //     )
// //   `)
// //   .eq('user_id', user.id)

// //   console.log("CLASS MEMBERS", classMembers);


// //   // Get student counts for each class
// //   const classIds = classMembers?.map((cm: any) => cm.class_id) || [];
// //   const classesWithCounts = await Promise.all(
// //     (classMembers || []).map(async (member: any) => {
// //       const { count } = await supabase
// //         .from("class_members")
// //         .select("*", { count: "exact", head: true })
// //         .eq("class_id", member.class_id)
// //         .eq("role", "student");

// //       return {
// //         ...member,
// //         studentCount: count || 0,
// //       };
// //     })
// //   );

// //   // Get assignments for each class
// //   const classesWithAssignments = await Promise.all(
// //     classesWithCounts.map(async (member: any) => {
// //       const { data: assignments } = await supabase
// //         .from("assignments")
// //         .select("id, title, due_date")
// //         .eq("class_id", member.class_id)
// //         .order("due_date", { ascending: true })
// //         .limit(3);

// //       return {
// //         ...member,
// //         assignments: assignments || [],
// //       };
// //     })
// //   );

// //   return (
// //     <div className="space-y-6">
// //       {/* Banner Section - Full Width */}
// //       <DashboardBanner userName={userName} userId={user.id} />

// //       {/* Classes Grid - With Container */}
// //       <div className="container mx-auto px-4 lg:px-20">
// //         {classesWithAssignments && classesWithAssignments.length > 0 ? (
// //           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
// //             {classesWithAssignments.map((member: any) => (
// //               <ClassCard
// //                 key={member.id}
// //                 classId={member.class_id}
// //                 classData={member.classes}
// //                 role={member.role}
// //                 studentCount={member.studentCount}
// //                 assignments={member.assignments}
// //               />
// //             ))}
// //           </div>
// //         ) : (
// //           <Card>
// //             <CardContent className="py-12 text-center">
// //               <p className="text-gray-600 mb-4">
// //                 You haven't joined any classes yet.
// //               </p>
// //               <div className="flex gap-4 justify-center">
// //                 <Link href="/dashboard/classes/create">
// //                   <Button variant="primary">Create Classroom</Button>
// //                 </Link>
// //                 <Link href="/dashboard/classes">
// //                   <Button variant="outline">Join Classroom</Button>
// //                 </Link>
// //               </div>
// //             </CardContent>
// //           </Card>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// import { createClient } from "@/lib/supabase/server";
// import Link from "next/link";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import DashboardBanner from "@/components/dashboard/DashboardBanner";
// import ClassCard from "@/components/dashboard/ClassCard";
// // import CreateClassModal from '@/components/class/CreateClassModal'
// // import { useState } from "react";

// export default async function DashboardPage() {
//   const supabase = await createClient();
//   // const [createClassModal, setCreateClassModal] = useState(false);
//   const { data: { user } } = await supabase.auth.getUser();
//   if (!user) return null;

//   // 1. Fetch all dashboard data in ONE call
//   const { data: dashboardData, error } = await supabase
//     .rpc('get_user_dashboard_data', { p_user_id: user.id } as any);

//   if (error) {
//     console.error("Error loading dashboard:", error);
//     return <p>Error loading dashboard.</p>;
//   }

//   // Handle empty state
//   if (!dashboardData || (dashboardData as any[]).length === 0) {
//     return (
//       <div className="space-y-6">
//         <DashboardBanner userName={user.user_metadata?.full_name || "User"} userId={user.id} />
//         <div className="container mx-auto px-4 lg:px-20">
//             <CardContent className="py-12 text-center">
//               <p className="text-gray-600 mb-4">You haven't joined any classes yet.</p>
//               {/* <div className="flex gap-4 justify-center">
//                 <div onClick={() => setCreateClassModal(true)}>
//                   <Button variant="primary">Create Classroom</Button>
//                 </div>
//                 <div >
//                   <Button variant="outline">Join Classroom</Button>
//                 </div>
//               </div> */}
//             </CardContent>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <DashboardBanner userName={user.user_metadata?.full_name || "User"} userId={user.id} />
//       <div className="container mx-auto px-4 lg:px-20">
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {(dashboardData as any[]).map((item: any) => (
//             <ClassCard
//               key={item.class_id}
//               classId={item.class_id}
//               classData={item.classes}
//               role={item.role}
//               isPinned={item.is_pinned}
//               studentCount={item.student_count || 0}
//               assignments={item.assignments || []}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import { createClient } from "@/lib/supabase/server";
import DashboardBanner from "@/components/dashboard/DashboardBanner";
import ClassCard from "@/components/dashboard/ClassCard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: dashboardData, error } = await supabase
    .rpc('get_user_dashboard_data', { p_user_id: user.id } as any);

  if (error) {
    console.error("Error loading dashboard:", error);
    return <p className="p-8 text-muted-foreground text-sm">Error loading dashboard.</p>;
  }

  const userName = user.user_metadata?.full_name || "User";
  const isEmpty  = !dashboardData || (dashboardData as any[]).length === 0;

  return (
    <div className="min-h-screen bg-background">
      <DashboardBanner userName={userName} userId={user.id} />

      <div className="container mx-auto px-4 lg:px-20 py-8">
        {isEmpty ? (
          /* ── Empty state ────────────────────────────────────────────── */
          <div className="flex flex-col items-center justify-center text-center
            py-20 border-2 border-dashed border-border rounded-2xl bg-white">

            <div className="size-16 rounded-2xl bg-navy/8 border border-navy/15
              flex items-center justify-center mb-5">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="3" y="5" width="22" height="18" rx="4" stroke="#043873" strokeWidth="1.8"/>
                <path d="M9 11h10M9 15h7" stroke="#043873" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="21" cy="21" r="6" fill="white" stroke="#043873" strokeWidth="1.5"/>
                <path d="M21 18v3l2 1" stroke="#043873" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </div>

            <h2 className="font-black text-[22px] tracking-tight mb-2">
              No classes yet
            </h2>
            <p className="text-[14px] text-muted-foreground max-w-xs mb-8 leading-relaxed">
              Create your first classroom or join one using a class code from your teacher.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <button className="inline-flex items-center gap-2 bg-navy text-white
                font-semibold text-[14px] px-6 py-3 rounded-lg
                hover:bg-navy/90 hover:-translate-y-0.5 transition-all
                cursor-pointer border-none">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                Create a class
              </button>
              <button className="inline-flex items-center gap-2 bg-secondary border border-border
                text-foreground font-semibold text-[14px] px-6 py-3 rounded-lg
                hover:border-navy/30 hover:-translate-y-0.5 transition-all cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Join a class
              </button>
            </div>
          </div>
        ) : (
          /* ── Classes grid ────────────────────────────────────────────── */
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {(dashboardData as any[]).map((item: any) => (
              <ClassCard
                key={item.class_id}
                classId={item.class_id}
                classData={item.classes}
                role={item.role}
                isPinned={item.is_pinned}
                studentCount={item.student_count || 0}
                assignments={item.assignments || []}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}