// "use client";

// import { useEffect, useState, useMemo } from "react";
// import { createClient } from "@/lib/supabase/client";
// import {
//   Plus,
//   Pencil,
//   Trash2,
//   UserMinus,
//   Search,
//   Check,
//   Users,
//   X,
//   AlertCircle,
//   Loader2,
// } from "lucide-react";
// import {
//   saveGroup,
//   deleteGroup,
//   removeGroupMember,
// } from "@/components/class/ClassActions";
// import Loader from "@/components/layout/Loader";
// /* ---------- TYPES ---------- */
// interface Profile {
//   full_name: string | null;
// }

// interface ProjectMember {
//   user_id: string;
//   profiles: Profile | Profile[];
// }

// interface Group {
//   id: string;
//   title: string;
//   project_members: ProjectMember[];
// }

// interface ClassMember {
//   user_id: string;
//   profiles: Profile | Profile[];
// }

// interface Props {
//   classId: string;
//   isTeacher: boolean;
// }

// export default function GroupsTab({ classId, isTeacher }: Props) {
//   const supabase = createClient();

//   // Data State
//   const [groups, setGroups] = useState<Group[]>([]);
//   const [allClassMembers, setAllClassMembers] = useState<ClassMember[]>([]);
//   const [loading, setLoading] = useState(true);

//   // UI State
//   const [showModal, setShowModal] = useState(false);
//   const [groupTitle, setGroupTitle] = useState("");
//   const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
//   const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     fetchData();
//   }, [classId]);

//   async function fetchData() {
//     setLoading(true);
//     setError(null);
//     try {
//       const [groupsRes, membersRes] = await Promise.all([
//         supabase
//           .from("group_projects")
//           .select(
//             `id, title, project_members(user_id, profiles:user_id(full_name))`
//           )
//           .eq("class_id", classId),
//         supabase
//           .from("class_members")
//           .select(`user_id, profiles:user_id(full_name)`)
//           .eq("class_id", classId),
//       ]);

//       if (groupsRes.error) throw groupsRes.error;
//       if (membersRes.error) throw membersRes.error;

//       setGroups(groupsRes.data ?? []);
//       setAllClassMembers(membersRes.data ?? []);
//     } catch (err: any) {
//       setError("Failed to load group data.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   /* ---------- FILTERING LOGIC ---------- */
//   const availableStudents = useMemo(() => {
//     // IDs of all students already in any group
//     const assignedIds = groups.flatMap((g) =>
//       g.project_members.map((m) => m.user_id)
//     );

//     // IDs of students currently in the group we are editing (so we don't hide them from the list)
//     const currentGroupMemberIds = editingGroupId
//       ? groups
//           .find((g) => g.id === editingGroupId)
//           ?.project_members.map((m) => m.user_id) || []
//       : [];

//     return allClassMembers.filter((member) => {
//       const isUnassigned = !assignedIds.includes(member.user_id);
//       const isAlreadyInThisGroup = currentGroupMemberIds.includes(
//         member.user_id
//       );
//       return isUnassigned || isAlreadyInThisGroup;
//     });
//   }, [allClassMembers, groups, editingGroupId]);

//   const filteredStudents = availableStudents.filter((s) => {
//     const profile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
//     return profile?.full_name
//       ?.toLowerCase()
//       .includes(searchQuery.toLowerCase());
//   });

//   /* ---------- ACTIONS ---------- */
//   const handleToggleStudent = (id: string) => {
//     setSelectedStudentIds((prev) =>
//       prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
//     );
//   };

//   const handleSave = async () => {
//     if (!groupTitle.trim()) {
//       setError("Group title is required");
//       return;
//     }

//     setSubmitting(true);
//     setError(null);
//     try {
//       await saveGroup(classId, groupTitle, editingGroupId, selectedStudentIds);
//       closeModal();
//       fetchData();
//     } catch (err: any) {
//       setError(err.message || "Failed to save group");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Dissolve this group? Members will become unassigned."))
//       return;
//     try {
//       await deleteGroup(id, classId);
//       fetchData();
//     } catch (err) {
//       alert("Error deleting group");
//     }
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setGroupTitle("");
//     setEditingGroupId(null);
//     setSelectedStudentIds([]);
//     setSearchQuery("");
//     setError(null);
//   };

//   if (loading)
//     return (
//       <Loader text="Loading Groups" border="border-indigo-500"/> 

//     );

//   return (
//     <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-300 pb-6 mb-8">
//         <div>
//           <h2 className="text-3xl font-bold text-slate-900">
//             Collaboration Groups
//           </h2>
//           <p className="text-slate-500 mt-1">
//             Manage student teams and project assignments
//           </p>
//         </div>

//         {isTeacher && (
//           <button
//             onClick={() => setShowModal(true)}
//             className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full transition-all shadow-md font-medium"
//           >
//             <Plus size={20} /> New Group
//           </button>
//         )}
//       </div>

//       {/* Main List */}
//       <div className="space-y-0">
//         {groups.length === 0 ? (
//           <div className="border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center text-slate-400 bg-white/50">
//             <Users size={48} className="mx-auto mb-4 opacity-10" />
//             <p className="text-lg">No groups created yet.</p>
//           </div>
//         ) : (
//           groups.map((group) => (
//             <div
//               key={group.id}
//               className="group border-b border-gray-300 max-w-4xl group block relative bg-white hover:bg-indigo-50/30 transition-all overflow-hidden mx-auto"
//             >
//               <div className="flex flex-col md:flex-row">
//                 {/* Left: Info */}
//                 <div className="p-6 md:w-1/3 bg-slate-50/50 border-b md:border-b-0 md:border-r border-slate-100">
//                   <div className="flex items-center gap-3 mb-1">
//                     <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
//                       <Users size={18} />
//                     </div>
//                     <h3 className="font-bold text-slate-900 truncate">
//                       {group.title}
//                     </h3>
//                   </div>
//                   <p className="text-xs text-slate-500 font-medium mb-4">
//                     {group.project_members.length} Members
//                   </p>

//                   {isTeacher && (
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => {
//                           setEditingGroupId(group.id);
//                           setGroupTitle(group.title);
//                           setSelectedStudentIds(
//                             group.project_members.map((m) => m.user_id)
//                           );
//                           setShowModal(true);
//                         }}
//                         className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-all"
//                       >
//                         <Pencil size={14} /> Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(group.id)}
//                         className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-red-600 hover:border-red-200 transition-all"
//                       >
//                         <Trash2 size={14} />
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 {/* Right: Members */}
//                 <div className="p-6 w-full  gap-2">
//                   {group.project_members.map((m) => {
//                     const profile = Array.isArray(m.profiles)
//                       ? m.profiles[0]
//                       : m.profiles;
//                     return (
//                       <div
//                         key={m.user_id}
//                         className="flex justify-between w-full group/member px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
//                       >
//                         <span className="text-sm font-medium text-slate-700">
//                           {profile?.full_name}
//                         </span>
//                         {isTeacher && (
//                           <button
//                             onClick={() =>
//                               removeGroupMember(
//                                 group.id,
//                                 m.user_id,
//                                 classId
//                               ).then(fetchData)
//                             }
//                             className="opacity-0 group-hover/member:opacity-100 text-slate-300 hover:text-red-500 transition-all"
//                           >
//                             <UserMinus size={14} />
//                           </button>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
//           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
//             <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
//               <h3 className="font-bold text-slate-900 text-lg">
//                 {editingGroupId ? "Update Group" : "Create Group"}
//               </h3>
//               <button
//                 onClick={closeModal}
//                 className="text-slate-400 hover:text-slate-600"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-6 space-y-5">
//               {error && (
//                 <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs flex items-center gap-2 border border-red-100">
//                   <AlertCircle size={14} /> {error}
//                 </div>
//               )}

//               <div className="space-y-1">
//                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                   Team Name
//                 </label>
//                 <input
//                   autoFocus
//                   value={groupTitle}
//                   onChange={(e) => setGroupTitle(e.target.value)}
//                   placeholder="e.g. Design Team Alpha"
//                   className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
//                 />
//               </div>

//               <div className="space-y-3">
//                 <div className="flex justify-between items-center">
//                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                     Assign Students
//                   </label>
//                   <span className="text-[10px] font-bold text-indigo-600">
//                     {selectedStudentIds.length} Selected
//                   </span>
//                 </div>

//                 <div className="relative">
//                   <Search
//                     className="absolute left-3 top-2.5 text-slate-400"
//                     size={16}
//                   />
//                   <input
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Search available students..."
//                     className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
//                   />
//                 </div>

//                 <div className="max-h-52 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
//                   {filteredStudents.length === 0 ? (
//                     <div className="text-center py-8 text-slate-400 text-xs italic">
//                       No students available
//                     </div>
//                   ) : (
//                     filteredStudents.map((s) => {
//                       const profile = Array.isArray(s.profiles)
//                         ? s.profiles[0]
//                         : s.profiles;
//                       const isSelected = selectedStudentIds.includes(s.user_id);
//                       return (
//                         <button
//                           key={s.user_id}
//                           onClick={() => handleToggleStudent(s.user_id)}
//                           className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${
//                             isSelected
//                               ? "bg-indigo-50 border-indigo-200 text-indigo-700"
//                               : "bg-white border-slate-100 text-slate-600 hover:border-slate-300"
//                           }`}
//                         >
//                           <span className="text-sm font-medium">
//                             {profile?.full_name}
//                           </span>
//                           {isSelected ? (
//                             <Check size={16} />
//                           ) : (
//                             <Plus size={14} className="text-slate-300" />
//                           )}
//                         </button>
//                       );
//                     })
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 pt-2 flex gap-3">
//               <button
//                 onClick={closeModal}
//                 className="flex-1 py-2.5 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-xl transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 disabled={submitting}
//                 className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center"
//               >
//                 {submitting ? (
//                   <Loader2 className="animate-spin" size={18} />
//                 ) : editingGroupId ? (
//                   "Update"
//                 ) : (
//                   "Create"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { ensureAuth } from "@/hooks/useRealtime";
import {
  Plus, Pencil, Trash2, UserMinus, Search, RefreshCw,
  Check, Users2, X, AlertCircle, Loader2,
} from "lucide-react";
import {
  saveGroup,
  deleteGroup,
  removeGroupMember,
} from "@/components/class/ClassActions";
import Loader from "@/components/layout/Loader";

/* ── Types ── */
interface Profile     { full_name: string | null }
interface ProjectMember { user_id: string; profiles: Profile | Profile[] }
interface Group       { id: string; title: string; project_members: ProjectMember[] }
interface ClassMember { user_id: string; profiles: Profile | Profile[] }
interface Props       { classId: string; isTeacher: boolean }

/* ── Helpers ── */
const getName = (profiles: Profile | Profile[]) =>
  (Array.isArray(profiles) ? profiles[0] : profiles)?.full_name ?? "Unknown"

/* ─────────────────────────────────────────────────────────────────────────── */
export default function GroupsTab({ classId, isTeacher }: Props) {
  const supabase = createClient()

  const [groups,          setGroups]          = useState<Group[]>([])
  const [allClassMembers, setAllClassMembers] = useState<ClassMember[]>([])
  const [loading,         setLoading]         = useState(true)
  const [showModal,       setShowModal]       = useState(false)
  const [groupTitle,      setGroupTitle]      = useState("")
  const [editingGroupId,  setEditingGroupId]  = useState<string | null>(null)
  const [selectedIds,     setSelectedIds]     = useState<string[]>([])
  const [searchQuery,     setSearchQuery]     = useState("")
  const [error,           setError]           = useState<string | null>(null)
  const [submitting,      setSubmitting]      = useState(false)

  useEffect(() => { fetchData() }, [classId])

  async function fetchData() {
    setLoading(true); setError(null)
    try {
      const authed = await ensureAuth(supabase)
      if (!authed) { setError('Not authenticated.'); return }
      const [groupsRes, membersRes] = await Promise.all([
        supabase
          .from("group_projects")
          .select("id, title, project_members(user_id, profiles:user_id(full_name))")
          .eq("class_id", classId),
        supabase
          .from("class_members")
          .select("user_id, profiles:user_id(full_name)")
          .eq("class_id", classId),
      ])
      if (groupsRes.error) throw groupsRes.error
      if (membersRes.error) throw membersRes.error
      setGroups(groupsRes.data ?? [])
      setAllClassMembers(membersRes.data ?? [])
    } catch { setError("Failed to load group data.") }
    finally  { setLoading(false) }
  }

  /* ── Filtered students ── */
  const availableStudents = useMemo(() => {
    const assignedIds = groups.flatMap((g) => g.project_members.map((m) => m.user_id))
    const currentGroupIds = editingGroupId
      ? groups.find((g) => g.id === editingGroupId)?.project_members.map((m) => m.user_id) ?? []
      : []
    return allClassMembers.filter(
      (m) => !assignedIds.includes(m.user_id) || currentGroupIds.includes(m.user_id)
    )
  }, [allClassMembers, groups, editingGroupId])

  const filteredStudents = availableStudents.filter((s) =>
    getName(s.profiles).toLowerCase().includes(searchQuery.toLowerCase())
  )

  /* ── Actions ── */
  const handleToggle = (id: string) =>
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id])

  const handleSave = async () => {
    if (!groupTitle.trim()) { setError("Group name is required"); return }
    setSubmitting(true); setError(null)
    try {
      await saveGroup(classId, groupTitle, editingGroupId, selectedIds)
      closeModal(); fetchData()
    } catch (err: any) {
      setError(err.message || "Failed to save group")
    } finally { setSubmitting(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Dissolve this group? Members will become unassigned.")) return
    try { await deleteGroup(id, classId); fetchData() }
    catch { alert("Error deleting group") }
  }

  const openEdit = (group: Group) => {
    setEditingGroupId(group.id)
    setGroupTitle(group.title)
    setSelectedIds(group.project_members.map((m) => m.user_id))
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false); setGroupTitle(""); setEditingGroupId(null)
    setSelectedIds([]); setSearchQuery(""); setError(null)
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-muted flex items-center justify-center" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-40" />
              <div className="h-3 bg-muted rounded w-48" />
            </div>
          </div>
          <div className="h-9 w-40 bg-muted rounded-xl" />
        </div>

        <div className="bg-white border border-border rounded-2xl overflow-hidden animate-pulse">
          {[1, 2].map((i) => (
            <div
              key={i}
              className={`flex items-start gap-4 p-5 ${i === 1 ? "border-b border-border" : ""}`}
            >
              <div className="shrink-0 size-11 rounded-xl bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-1/3" />
                <div className="flex flex-wrap gap-2 mt-2">
                  <div className="h-3 bg-muted rounded w-20" />
                  <div className="h-3 bg-muted rounded w-16" />
                  <div className="h-3 bg-muted rounded w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error && groups.length === 0) {
    return (
      <div className="flex flex-col gap-6 py-6">
        <div className="flex flex-col items-center justify-center gap-4 py-16
          border-2 border-dashed border-border rounded-2xl bg-white text-center">
          <Users2 size={32} className="text-muted-foreground/40" />
          <p className="text-[14px] font-medium text-muted-foreground">{error}</p>
          <button
            onClick={() => fetchData()}
            className="inline-flex items-center gap-2 bg-navy text-white font-semibold
              text-[13px] px-5 py-2.5 rounded-xl hover:bg-navy/90 transition cursor-pointer
              border-none">
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      </div>
    )
  }

  /* ── Render ── */
  return (
    <div className="flex flex-col gap-6 py-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-navy flex items-center justify-center">
            <Users2 size={17} className="text-yellow" />
          </div>
          <div>
            <h2 className="font-black text-[18px] tracking-tight">Collaboration Groups</h2>
            <p className="text-[13px] text-muted-foreground">Manage student teams</p>
          </div>
        </div>
        {isTeacher && (
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-navy text-white font-semibold
              text-[13px] px-5 py-2.5 rounded-xl shadow-sm hover:bg-navy/90
              hover:-translate-y-0.5 transition-all cursor-pointer border-none">
            <Plus size={14} /> New group
          </button>
        )}
      </div>

      {/* Empty state */}
      {groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3
          py-16 border-2 border-dashed border-border rounded-2xl bg-white text-center">
          <div className="size-14 rounded-2xl bg-navy/8 border border-navy/15
            flex items-center justify-center">
            <Users2 size={24} className="text-navy/40" />
          </div>
          <p className="font-bold text-[16px] tracking-tight">No groups yet</p>
          <p className="text-[13px] text-muted-foreground max-w-xs leading-relaxed">
            {isTeacher
              ? "Create a group and assign students to collaborate on projects."
              : "Your teacher hasn't created any groups yet."}
          </p>
          {isTeacher && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-2 inline-flex items-center gap-2 bg-navy text-white
                font-semibold text-[13px] px-5 py-2.5 rounded-xl
                hover:bg-navy/90 transition cursor-pointer border-none">
              <Plus size={14} /> Create first group
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {groups.map((group) => (
            <div key={group.id}
              className="bg-white border border-border rounded-2xl overflow-hidden
                hover:shadow-sm transition-all">
              <div className="flex flex-col md:flex-row">

                {/* Left panel */}
                <div className="md:w-56 shrink-0 p-5 bg-secondary/50 border-b
                  md:border-b-0 md:border-r border-border flex flex-col gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-xl bg-navy/8 border border-navy/15
                      flex items-center justify-center">
                      <Users2 size={14} className="text-navy" />
                    </div>
                    <h3 className="font-bold text-[14px] text-foreground truncate">
                      {group.title}
                    </h3>
                  </div>

                  <span className="text-[11px] font-bold tracking-widest uppercase
                    text-muted-foreground">
                    {group.project_members.length} member{group.project_members.length !== 1 ? 's' : ''}
                  </span>

                  {isTeacher && (
                    <div className="flex gap-2 mt-auto pt-1">
                      <button
                        onClick={() => openEdit(group)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5
                          text-[12px] font-semibold px-3 py-1.5 bg-white border border-border
                          rounded-lg text-foreground hover:text-navy hover:border-navy/30
                          transition cursor-pointer">
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(group.id)}
                        className="px-3 py-1.5 bg-white border border-border rounded-lg
                          text-muted-foreground hover:text-red-500 hover:border-red-200
                          transition cursor-pointer">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Right panel — members */}
                <div className="flex-1 p-5">
                  {group.project_members.length === 0 ? (
                    <p className="text-[12px] text-muted-foreground italic py-2">
                      No members assigned yet
                    </p>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {group.project_members.map((m) => (
                        <div key={m.user_id}
                          className="group/member flex items-center justify-between
                            px-3 py-2 rounded-xl hover:bg-secondary transition-colors">
                          <div className="flex items-center gap-2.5">
                            <div className="size-7 rounded-lg bg-navy/8 border border-navy/15
                              flex items-center justify-center text-[11px] font-black text-navy">
                              {getName(m.profiles).charAt(0).toUpperCase()}
                            </div>
                            <span className="text-[13px] font-medium text-foreground">
                              {getName(m.profiles)}
                            </span>
                          </div>
                          {isTeacher && (
                            <button
                              onClick={() =>
                                removeGroupMember(group.id, m.user_id, classId).then(fetchData)
                              }
                              className="opacity-0 group-hover/member:opacity-100
                                text-muted-foreground/40 hover:text-red-500 transition-all
                                cursor-pointer bg-transparent border-none">
                              <UserMinus size={13} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm flex items-center
          justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-black text-[17px] tracking-tight">
                {editingGroupId ? "Update group" : "Create group"}
              </h3>
              <button onClick={closeModal}
                className="p-1.5 text-muted-foreground hover:text-foreground
                  hover:bg-secondary rounded-lg transition cursor-pointer
                  bg-transparent border-none">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5">
              {/* Error */}
              {error && (
                <div className="flex items-center gap-2.5 bg-red-50 border border-red-200
                  text-red-600 text-[13px] font-semibold px-4 py-3 rounded-xl">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              {/* Group name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold tracking-[.18em] uppercase text-navy">
                  Group name
                </label>
                <input
                  autoFocus
                  value={groupTitle}
                  onChange={(e) => setGroupTitle(e.target.value)}
                  placeholder="e.g. Design Team Alpha"
                  className="w-full px-4 py-3 bg-white border border-border rounded-xl
                    text-[14px] text-foreground placeholder:text-muted-foreground
                    focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy
                    transition"
                />
              </div>

              {/* Student selector */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold tracking-[.18em] uppercase text-navy">
                    Assign students
                  </label>
                  {selectedIds.length > 0 && (
                    <span className="text-[11px] font-bold text-navy bg-yellow/20
                      border border-yellow/40 rounded-full px-2 py-0.5">
                      {selectedIds.length} selected
                    </span>
                  )}
                </div>

                {/* Search */}
                <div className="relative">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2
                    text-muted-foreground pointer-events-none" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search students…"
                    className="w-full pl-9 pr-4 py-2.5 bg-secondary border border-border
                      rounded-xl text-[13px] text-foreground placeholder:text-muted-foreground
                      focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy
                      transition"
                  />
                </div>

                {/* Student list */}
                <div className="max-h-52 overflow-y-auto flex flex-col gap-1 pr-0.5">
                  {filteredStudents.length === 0 ? (
                    <p className="text-center py-8 text-[12px] text-muted-foreground italic">
                      No students available
                    </p>
                  ) : (
                    filteredStudents.map((s) => {
                      const isSelected = selectedIds.includes(s.user_id)
                      return (
                        <button
                          key={s.user_id}
                          onClick={() => handleToggle(s.user_id)}
                          className={`w-full flex items-center justify-between px-3 py-2.5
                            rounded-xl border text-[13px] font-medium transition cursor-pointer
                            ${isSelected
                              ? "bg-navy/8 border-navy/20 text-navy"
                              : "bg-white border-border text-foreground hover:border-navy/20 hover:bg-secondary"
                            }`}>
                          <div className="flex items-center gap-2.5">
                            <div className={`size-6 rounded-lg flex items-center justify-center
                              text-[10px] font-black border transition
                              ${isSelected
                                ? "bg-navy text-yellow border-navy"
                                : "bg-secondary text-navy border-border"
                              }`}>
                              {getName(s.profiles).charAt(0).toUpperCase()}
                            </div>
                            {getName(s.profiles)}
                          </div>
                          {isSelected
                            ? <Check size={14} className="text-navy" />
                            : <Plus size={13} className="text-muted-foreground/40" />
                          }
                        </button>
                      )
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={closeModal}
                className="flex-1 py-3 text-[14px] font-semibold text-muted-foreground
                  hover:text-foreground hover:bg-secondary rounded-xl transition
                  cursor-pointer bg-transparent border-none">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-2
                  bg-navy text-white font-semibold text-[14px] py-3 rounded-xl
                  hover:bg-navy/90 transition disabled:opacity-60 cursor-pointer border-none">
                {submitting
                  ? <Loader2 size={15} className="animate-spin" />
                  : editingGroupId ? "Update" : "Create"
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}