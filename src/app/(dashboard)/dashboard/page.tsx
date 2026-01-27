// import { createClient } from "@/lib/supabase/server";
// import Link from "next/link";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { format } from "date-fns";
// import { Plus, Home, ListTodo, MoreVertical, Users } from "lucide-react";
// import DashboardBanner from "@/components/dashboard/DashboardBanner";
// import ClassCard from "@/components/dashboard/ClassCard";

// export default async function DashboardPage() {
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     return null;
//   }

//   // Get user profile for greeting - check metadata first (for OAuth users), then database
//   let userName =
//     user.user_metadata?.full_name || user.user_metadata?.name || null;

//   if (!userName) {
//     const { data: userProfile, error } = await supabase
//       .from("users")
//       .select("full_name")
//       .eq("id", user.id)
//       .single();

//     if (!error && userProfile) {
//       userName = (userProfile as any)?.full_name;
//     }
//   }

//   // Final fallback to email or 'User'
//   userName = userName || user.email?.split("@")[0] || "User";

//   // Get user's classes with member counts
//   const { data: classMembers } = await supabase
//   .from('class_members')
//   .select(`
//     id,
//     role,
//     class_id,
//     joined_at,
//     classes:classes (
//       id,
//       name
//     )
//   `)
//   .eq('user_id', user.id)

//   console.log("CLASS MEMBERS", classMembers);


//   // Get student counts for each class
//   const classIds = classMembers?.map((cm: any) => cm.class_id) || [];
//   const classesWithCounts = await Promise.all(
//     (classMembers || []).map(async (member: any) => {
//       const { count } = await supabase
//         .from("class_members")
//         .select("*", { count: "exact", head: true })
//         .eq("class_id", member.class_id)
//         .eq("role", "student");

//       return {
//         ...member,
//         studentCount: count || 0,
//       };
//     })
//   );

//   // Get assignments for each class
//   const classesWithAssignments = await Promise.all(
//     classesWithCounts.map(async (member: any) => {
//       const { data: assignments } = await supabase
//         .from("assignments")
//         .select("id, title, due_date")
//         .eq("class_id", member.class_id)
//         .order("due_date", { ascending: true })
//         .limit(3);

//       return {
//         ...member,
//         assignments: assignments || [],
//       };
//     })
//   );

//   return (
//     <div className="space-y-6">
//       {/* Banner Section - Full Width */}
//       <DashboardBanner userName={userName} userId={user.id} />

//       {/* Classes Grid - With Container */}
//       <div className="container mx-auto px-4 lg:px-20">
//         {classesWithAssignments && classesWithAssignments.length > 0 ? (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
//             {classesWithAssignments.map((member: any) => (
//               <ClassCard
//                 key={member.id}
//                 classId={member.class_id}
//                 classData={member.classes}
//                 role={member.role}
//                 studentCount={member.studentCount}
//                 assignments={member.assignments}
//               />
//             ))}
//           </div>
//         ) : (
//           <Card>
//             <CardContent className="py-12 text-center">
//               <p className="text-gray-600 mb-4">
//                 You haven't joined any classes yet.
//               </p>
//               <div className="flex gap-4 justify-center">
//                 <Link href="/dashboard/classes/create">
//                   <Button variant="primary">Create Classroom</Button>
//                 </Link>
//                 <Link href="/dashboard/classes">
//                   <Button variant="outline">Join Classroom</Button>
//                 </Link>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// }

import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardBanner from "@/components/dashboard/DashboardBanner";
import ClassCard from "@/components/dashboard/ClassCard";
// import CreateClassModal from '@/components/class/CreateClassModal'
// import { useState } from "react";

export default async function DashboardPage() {
  const supabase = await createClient();
  // const [createClassModal, setCreateClassModal] = useState(false);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // 1. Fetch all dashboard data in ONE call
  const { data: dashboardData, error } = await supabase
    .rpc('get_user_dashboard_data', { p_user_id: user.id } as any);

  if (error) {
    console.error("Error loading dashboard:", error);
    return <p>Error loading dashboard.</p>;
  }

  // Handle empty state
  if (!dashboardData || (dashboardData as any[]).length === 0) {
    return (
      <div className="space-y-6">
        <DashboardBanner userName={user.user_metadata?.full_name || "User"} userId={user.id} />
        <div className="container mx-auto px-4 lg:px-20">
            <CardContent className="py-12 text-center">
              <p className="text-gray-600 mb-4">You haven't joined any classes yet.</p>
              {/* <div className="flex gap-4 justify-center">
                <div onClick={() => setCreateClassModal(true)}>
                  <Button variant="primary">Create Classroom</Button>
                </div>
                <div >
                  <Button variant="outline">Join Classroom</Button>
                </div>
              </div> */}
            </CardContent>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardBanner userName={user.user_metadata?.full_name || "User"} userId={user.id} />
      <div className="container mx-auto px-4 lg:px-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      </div>
    </div>
  );
}