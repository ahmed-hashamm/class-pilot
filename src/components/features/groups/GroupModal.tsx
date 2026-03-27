"use client";

import { useState, useMemo } from "react";
import { Search, X, Check, Plus, AlertCircle, Loader2 } from "lucide-react";

interface GroupModalProps {
  editingGroup: any;
  allMembers: any[];
  onClose: () => void;
  onSave: (title: string, selectedIds: string[]) => void;
  submitting: boolean;
  error?: string | null;
}

export default function GroupModal({
  editingGroup,
  allMembers,
  onClose,
  onSave,
  submitting,
  error,
}: GroupModalProps) {
  const [title, setTitle] = useState(editingGroup?.title || "");
  const [selectedIds, setSelectedIds] = useState<string[]>(
    editingGroup?.project_members?.map((m: any) => m.user_id) || []
  );
  const [searchQuery, setSearchQuery] = useState("");

  const getName = (profiles: any) =>
    (Array.isArray(profiles) ? profiles[0] : profiles)?.full_name ?? "Unknown";

  const filteredMembers = useMemo(() => {
    return allMembers
      .filter((m) => m.role !== "teacher" && m.role !== "owner")
      .filter((m) =>
        getName(m.profiles).toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [allMembers, searchQuery]);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-black text-[17px] tracking-tight">
            {editingGroup ? "Update group" : "Create group"}
          </h3>
          <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all cursor-pointer bg-transparent border-none">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 text-[13px] font-semibold px-4 py-3 rounded-xl">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-[.18em] uppercase text-navy">Team Name</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design Team Alpha"
              className="w-full px-4 py-3 bg-white border border-border rounded-xl text-[14px] focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none transition"
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold tracking-[.18em] uppercase text-navy">Assign Students</label>
              {selectedIds.length > 0 && <span className="text-[11px] font-bold text-navy bg-yellow/20 border border-yellow/40 rounded-full px-2 py-0.5">{selectedIds.length} selected</span>}
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students…"
                className="w-full pl-9 pr-4 py-2.5 bg-secondary border border-border rounded-xl text-[13px] outline-none"
              />
            </div>

            <div className="max-h-52 overflow-y-auto flex flex-col gap-1 pr-0.5 custom-scrollbar">
              {filteredMembers.length === 0 ? (
                <p className="text-center py-8 text-[12px] text-muted-foreground italic">No students available</p>
              ) : (
                filteredMembers.map((s) => {
                  const isSelected = selectedIds.includes(s.user_id);
                  return (
                    <button
                      key={s.user_id}
                      onClick={() => handleToggle(s.user_id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-[13px] font-medium transition cursor-pointer ${isSelected ? "bg-navy/8 border-navy/20 text-navy" : "bg-white border-border hover:bg-secondary"}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`size-6 rounded-lg flex items-center justify-center text-[10px] font-black border ${isSelected ? "bg-navy text-yellow border-navy" : "bg-secondary text-navy border-border"}`}>
                          {getName(s.profiles).charAt(0).toUpperCase()}
                        </div>
                        {getName(s.profiles)}
                      </div>
                      {isSelected ? <Check size={14} className="text-navy" /> : <Plus size={13} className="text-muted-foreground/40" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="p-6 pt-2 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-muted-foreground font-bold text-[13px] hover:bg-secondary rounded-xl transition cursor-pointer bg-transparent border-none">Cancel</button>
          <button
            onClick={() => onSave(title, selectedIds)}
            disabled={submitting}
            className="flex-1 bg-navy text-white font-bold text-[13px] py-2.5 rounded-xl shadow-lg hover:bg-navy/90 disabled:opacity-50 transition flex items-center justify-center border-none cursor-pointer"
          >
            {submitting ? <Loader2 className="animate-spin" size={16} /> : editingGroup ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
