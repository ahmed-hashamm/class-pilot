"use client";

import { useState, useMemo } from "react";
import { Search, X, Check, Plus, AlertCircle, Loader2, UserX } from "lucide-react";
import StudentAvatar from "./GroupCard/StudentAvatar";
import { Group, BaseUser } from "@/lib/types/schema";

interface GroupModalProps {
  editingGroup: Group | null;
  groups: Group[];
  allMembers: { user_id: string; role: string; users: BaseUser | null }[];
  onClose: () => void;
  onSave: (title: string, selectedIds: string[]) => void;
  submitting: boolean;
  error?: string | null;
}

export default function GroupModal({
  editingGroup,
  groups,
  allMembers,
  onClose,
  onSave,
  submitting,
  error,
}: GroupModalProps) {
  const [title, setTitle] = useState(editingGroup?.title || "");
  const [selectedIds, setSelectedIds] = useState<string[]>(
    editingGroup?.project_members?.map((m: { user_id: string }) => m.user_id) || []
  );
  const [searchQuery, setSearchQuery] = useState("");

  const alreadyAssignedIds = useMemo(() => {
    const ids = new Set<string>();
    groups.forEach(g => {
      if (!editingGroup || g.id !== editingGroup.id) {
        g.project_members?.forEach((m: { user_id: string }) => {
          if (m.user_id) ids.add(m.user_id);
        });
      }
    });
    return ids;
  }, [groups, editingGroup]);

  const filteredMembers = useMemo(() => {
    return allMembers
      .filter((m) => m.role !== "teacher" && m.role !== "owner")
      .filter((m) =>
        (m.users?.full_name || "Unknown").toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [allMembers, searchQuery]);

  const handleToggle = (id: string, isAssignedElseWhere: boolean) => {
    if (isAssignedElseWhere) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-border">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-secondary/20">
          <div className="text-left">
            <h3 className="font-black text-[18px] tracking-tight text-foreground">
              {editingGroup ? "Update Group" : "Create New Group"}
            </h3>
            <p className="text-[11px] text-muted-foreground font-medium">Assignment collaboration team</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all cursor-pointer bg-transparent border-none">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 text-[13px] font-bold px-4 py-3.5 rounded-2xl animate-in slide-in-from-top-2">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <div className="flex flex-col gap-2 text-left">
            <label className="text-[11px] font-black tracking-[.2em] uppercase text-navy/40 pl-1">Team Name</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design Team Alpha"
              className="w-full px-4 py-3.5 bg-secondary/40 border border-border rounded-2xl text-[14px] font-bold focus:ring-4 focus:ring-navy/5 focus:border-navy outline-none transition placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center px-1">
              <label className="text-[11px] font-black tracking-[.2em] uppercase text-navy/40">Assign Students</label>
              {selectedIds.length > 0 && (
                <span className="text-[10px] font-black text-navy bg-yellow border border-yellow/20 rounded-full px-2.5 py-0.5 shadow-sm">
                  {selectedIds.length} SELECTED
                </span>
              )}
            </div>
            <div className="relative group">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-navy transition-colors" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students…"
                className="w-full pl-10 pr-4 py-3 bg-secondary/40 border border-border rounded-2xl text-[13px] font-semibold outline-none focus:border-navy transition"
              />
            </div>

            <div className="max-h-60 overflow-y-auto flex flex-col gap-1.5 pr-1 custom-scrollbar">
              {filteredMembers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 opacity-40">
                  <Search size={24} className="mb-2" />
                  <p className="text-[13px] font-bold italic">No students found</p>
                </div>
              ) : (
                filteredMembers.map((s) => {
                  const isSelected = selectedIds.includes(s.user_id);
                  const isAssignedElsewhere = alreadyAssignedIds.has(s.user_id);
                  const name = s.users?.full_name || "Unknown";
                  
                  return (
                    <button
                      key={s.user_id}
                      onClick={() => handleToggle(s.user_id, isAssignedElsewhere)}
                      disabled={isAssignedElsewhere}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl border-2 text-[13px] font-bold transition-all group/item
                        ${isSelected 
                          ? "bg-navy text-white border-navy shadow-md shadow-navy/10" 
                          : isAssignedElsewhere
                            ? "bg-secondary/20 border-border/10 text-muted-foreground/40 cursor-not-allowed"
                            : "bg-white border-border/50 hover:bg-secondary/50 hover:border-border cursor-pointer"}`}
                    >
                      <div className="flex items-center gap-3">
                        <StudentAvatar 
                          name={name} 
                          src={s.users?.avatar_url}
                          className={`size-8 ${isSelected ? 'border-white/20' : ''}`}
                        />
                        <div className="flex flex-col items-start gap-0.5">
                          <span className={isSelected ? "text-white" : "text-foreground group-hover/item:text-navy"}>
                            {name}
                          </span>
                          {isAssignedElsewhere && (
                            <span className="text-[10px] font-black uppercase tracking-tight text-muted-foreground/40">Already in a group</span>
                          )}
                        </div>
                      </div>
                      <div className={`size-5 rounded-lg flex items-center justify-center transition-all
                        ${isSelected 
                          ? "bg-white/20 text-white" 
                          : isAssignedElsewhere
                            ? "bg-transparent text-muted-foreground/20"
                            : "bg-secondary text-muted-foreground/30 group-hover/item:bg-navy/10"}`}>
                        {isSelected ? <Check size={12} /> : isAssignedElsewhere ? <UserX size={12} /> : <Plus size={12} />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="p-6 pt-2 flex gap-3 bg-secondary/10 border-t border-border">
          <button onClick={onClose} className="flex-1 py-3.5 text-muted-foreground font-black text-[12px] uppercase tracking-widest hover:bg-secondary rounded-2xl transition cursor-pointer bg-transparent border-none">
            Cancel
          </button>
          <button
            onClick={() => onSave(title, selectedIds)}
            disabled={submitting}
            className="flex-1 bg-navy text-white font-black text-[12px] uppercase tracking-widest py-3.5 rounded-2xl shadow-xl shadow-navy/20 hover:bg-navy/90 hover:shadow-2xl hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 transition-all flex items-center justify-center border-none cursor-pointer"
          >
            {submitting ? <Loader2 className="animate-spin" size={16} /> : editingGroup ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
