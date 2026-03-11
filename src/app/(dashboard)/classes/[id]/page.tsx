import { notFound } from "next/navigation"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ClassTabs from "@/components/class/ClassTabs"
import ClassDashboardClient from "@/components/class/ClassDashboardClient"
import { Suspense } from "react"

export default async function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch class
  const { data: rawClass, error: classError } = await supabase
    .from('classes')
    .select('*')
    .eq('id', id)
    .single()

  if (classError || !rawClass) {
    notFound()
  }

  // Fetch membership (optional)
  const { data: rawMember } = await supabase
    .from('class_members')
    .select('role')
    .eq('class_id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  const isTeacher =
  (rawMember as { role: string } | null)?.role === 'teacher' ||
  (rawClass as { created_by: string }).created_by === user.id 

  return (
    // <div className="min-h-screen bg-[#f8fafc]">
    //   {/* HEADER */}
    //   <div className="bg-[#003366] w-full pt-12 pb-8 px-8 rounded-b-[40px] shadow-2xl">
    //     <div className="max-w-7xl mx-auto">
    //       <h1 className="text-4xl font-bold text-white mb-2">
    //         {(rawClass as { name: string }).name}
    //       </h1>
    //       <p className="text-white/70 mb-6 font-medium">
    //         [{isTeacher ? 'Teacher' : 'Student'}]
    //       </p>
    //       <ClassTabs
    //         classId={id}
    //         isTeacher={isTeacher}
    //         classCode={(rawClass as { code: string }).code}
    //       />
    //     </div>
    //   </div>
    // </div>
    <>
{/* <div className="relative bg-navy text-primary-foreground w-full py-16 pb-0"> */}
{/* Wave decoration */}
{/* <div className="absolute inset-0 overflow-hidden opacity-80 text-accent">
<svg
className="w-full h-full"
viewBox="0 0 1200 300"
preserveAspectRatio="none"
>
<defs>
  <pattern
    id="heroWave"
    width="600"
    height="300"
    patternUnits="userSpaceOnUse"
  >
    <path
      d="M0,150 Q150,60 300,150 T600,150"
      stroke="currentColor"
      strokeWidth="0.6"
      fill="none"
    />
    <path
      d="M0,180 Q150,100 300,180 T600,180"
      stroke="currentColor"
      strokeWidth="0.4"
      fill="none"
      opacity="0.6"
    />
    <path
      d="M0,120 Q150,200 300,120 T600,120"
      stroke="currentColor"
      strokeWidth="0.4"
      fill="none"
      opacity="0.5"
    />
  </pattern>
</defs>

<rect width="100%" height="100%" fill="url(#heroWave)" />
</svg>
</div> */}

{/* <div className=" container mx-auto flex flex-col justify-between  px-6 lg:px-20">
<div className="max-w-7xl ">
          <h1 className="text-4xl font-bold text-white mb-2">
            {(rawClass as { name: string }).name}
          </h1>
          <p className="text-primary-foreground mb-6 font-medium">
            [{isTeacher ? 'Teacher' : 'Student'}]
          </p>
          <ClassTabs
            classId={id}
            isTeacher={isTeacher}
            classCode={(rawClass as { code: string }).code}
          />
        </div>
</div> */}
{/* </div> */}

<Suspense fallback={<div className="min-h-screen bg-navy flex items-center justify-center text-white font-bold tracking-widest uppercase">Loading class...</div>}>
  <ClassDashboardClient 
      classId={id}
      userId={user.id}
      className={(rawClass as any).name}
      classDescription={(rawClass as any).description}
      classSettings={(rawClass as any).settings}
      classCode={(rawClass as any).code}
      isTeacher={isTeacher}
    />
</Suspense>
</>
  )
}


// import { notFound, redirect } from "next/navigation"
// import { createClient } from "@/lib/supabase/server"
// import ClassTabs from "@/components/class/ClassTabs"
// import { Plus, Settings } from "lucide-react"
// import { Button } from "@/components/ui/button"

// export default async function ClassDetailPage({
//   params,
// }: {
//   params: Promise<{ id: string }>
// }) {
//   const { id } = await params

//   if (!id) notFound()

//   const supabase = await createClient()
//   const { data: { user } } = await supabase.auth.getUser()
//   if (!user) redirect('/login')

//   const { data: rawClass, error: classError } = await supabase
//     .from('classes')
//     .select('*')
//     .eq('id', id)
//     .single()

//   if (classError || !rawClass) notFound()

//   const { data: rawMember } = await supabase
//     .from('class_members')
//     .select('role')
//     .eq('class_id', id)
//     .eq('user_id', user.id)
//     .maybeSingle()

//   const isTeacher = (rawMember as { role: string } | null)?.role === 'teacher' || 
//                     (rawClass as { created_by: string }).created_by === user.id 

//   return (
//     <div className="min-h-screen bg-[#f8fafc]">
//       {/* 1. HERO SECTION (Blue Banner) */}
//       <div className="relative bg-[#003366] text-white w-full pt-16 pb-12 overflow-hidden">
//         {/* Wave Decoration */}
//         <div className="absolute inset-0 opacity-30 pointer-events-none">
//           <svg className="w-full h-full" viewBox="0 0 1200 300" preserveAspectRatio="none">
//             <defs>
//               <pattern id="heroWave" width="600" height="300" patternUnits="userSpaceOnUse">
//                 <path d="M0,150 Q150,60 300,150 T600,150" stroke="white" strokeWidth="0.6" fill="none" />
//                 <path d="M0,180 Q150,100 300,180 T600,180" stroke="white" strokeWidth="0.4" fill="none" opacity="0.6" />
//               </pattern>
//             </defs>
//             <rect width="100%" height="100%" fill="url(#heroWave)" />
//           </svg>
//         </div>

//         <div className="relative container mx-auto px-6 lg:px-20">
//           <div className="max-w-7xl mx-auto">
//             {/* Header Content */}
//             <div className="flex justify-between items-start mb-10">
//               <div>
//                 <h1 className="text-4xl lg:text-5xl font-bold mb-2 tracking-tight">
//                   {(rawClass as { name: string }).name}
//                 </h1>
//                 <p className="text-white/70 font-medium">
//                   {isTeacher ? 'Teacher' : 'Student'} • {(rawClass as { section: string }).section || 'General'}
//                 </p>
//               </div>

//               <div className="flex items-center gap-2">
//                 <Button variant="ghost" size="md" className="text-white hover:bg-white/10 rounded-full">
//                   <Plus size={24} />
//                 </Button>
//                 <Button variant="ghost" size="md" className="text-white hover:bg-white/10 rounded-full">
//                   <Settings size={20} />
//                 </Button>
//               </div>
//             </div>

//             {/* CLASS TABS (Navigation) */}
//             <ClassTabs
//               classId={id}
//               userId={user.id}
//               isTeacher={isTeacher}
//               classCode={(rawClass as { code: string }).code}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }