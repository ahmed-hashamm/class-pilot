import { useState } from "react";
import { MoreVertical, Sparkles, Pencil, Trash2, Loader2 } from "lucide-react";
import { Material } from "@/lib/types/schema";

interface MaterialActionsProps {
  material: Material;
  isSyncing: boolean;
  onSync: (id: string) => void;
  onEdit: (material: Material) => void;
  onDelete: (id: string) => void;
}

export default function MaterialActions({
  material,
  isSyncing,
  onSync,
  onEdit,
  onDelete,
}: MaterialActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="p-1 text-muted-foreground hover:text-navy hover:bg-secondary
          rounded-lg transition-all cursor-pointer bg-transparent border-none"
      >
        {isSyncing ? <Loader2 size={16} className="animate-spin" /> : <MoreVertical size={18} />}
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40 outline-none" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-10 z-50 bg-white border border-border
            rounded-2xl shadow-2xl shadow-navy/10 overflow-hidden min-w-[160px] animate-in fade-in zoom-in-95 duration-200">
            <div className="px-3 py-2 border-b border-border bg-secondary/20">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Actions</p>
            </div>
            
            <button
              onClick={() => { setMenuOpen(false); onSync(material.id); }}
              disabled={isSyncing}
              className="w-full flex items-center gap-3 px-4 py-3 text-[13px]
                font-black text-navy hover:bg-secondary transition-all
                cursor-pointer bg-transparent border-none text-left disabled:opacity-50"
            >
              <Sparkles size={14} className="text-navy/60" />
              {isSyncing ? "Syncing…" : "Sync for AI"}
            </button>
            
            <button
              onClick={() => { setMenuOpen(false); onEdit(material); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-[13px]
                font-black text-navy hover:bg-secondary transition-all
                cursor-pointer bg-transparent border-none text-left"
            >
              <Pencil size={14} className="text-navy/60" />
              Edit Detail
            </button>
            
            <div className="border-t border-border mt-1 pt-1">
              <button
                onClick={() => { setMenuOpen(false); onDelete(material.id); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-[13px]
                  font-black text-red-500 hover:bg-red-50 transition-all
                  cursor-pointer bg-transparent border-none text-left"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
