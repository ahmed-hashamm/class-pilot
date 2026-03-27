"use client";

import { useState, useEffect } from "react";
import { X, Settings, Save, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from 'sonner';
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: any; 
}

export default function ClassSettingsModal({ isOpen, onClose, classData }: ModalProps) {
  const router = useRouter();
  const supabase = createClient();
  
  // Initialize state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [settings, setSettings] = useState({ showClassCode: true });
  const [isSaving, setIsSaving] = useState(false);

  // SYNC: This runs whenever the modal opens or classData changes
 // Inside ClassSettingsModal.tsx
useEffect(() => {
  if (isOpen && classData) {
    // 1. Sync Text Fields
    setName(classData.name || "");
    setDescription(classData.description || "");
    
    // 2. Sync Toggle (Privacy Settings)
    // We check if settings exists and specifically if showClassCode is a boolean
    const existingSettings = classData.settings;
    const showCodeValue = existingSettings?.showClassCode;

    setSettings({ 
      showClassCode: typeof showCodeValue === 'boolean' ? showCodeValue : true 
    });
  }
}, [isOpen, classData]);

  if (!isOpen) return null;

  const handleToggleSetting = (key: string) => {
    setSettings((prev: any) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    if (!classData?.id) return;
    setIsSaving(true);

    try {
      const { error } = await (supabase.from('classes') as any)
        .update({
          name: name.trim(),
          description: description.trim(),
          settings: settings // Saves the current toggle state back to DB
        })
        .eq('id', classData.id);

      if (error) throw error;
      toast.success("Settings updated successfully");
      onClose();
      router.refresh();
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error(err.message || "Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-navy/40 backdrop-blur-sm" 
        onClick={() => !isSaving && onClose()} 
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2">
            <Settings size={20} className="text-accent-dark" /> 
            Class Settings
          </h2>
          <button onClick={onClose} disabled={isSaving} className="p-2 hover:bg-zinc-200 rounded-full text-zinc-500 disabled:opacity-30 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 space-y-8 overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-navy/30 uppercase tracking-[0.2em]">General Info</h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Class Name</label>
              <input 
                type="text" 
                value={name}
                placeholder="Enter class name..."
                disabled={isSaving}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 text-navy font-medium rounded-xl border border-zinc-200 focus:ring-2 focus:ring-accent outline-none transition-all disabled:bg-zinc-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Description</label>
              <textarea 
                rows={2}
                value={description}
                placeholder="Add a description..."
                disabled={isSaving}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 text-navy font-medium rounded-xl border border-zinc-200 focus:ring-2 focus:ring-accent outline-none transition-all resize-none disabled:bg-zinc-50"
              />
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-zinc-100">
            <h3 className="text-xs font-black text-navy/30 uppercase tracking-[0.2em]">Privacy Settings</h3>
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-100 transition-all">
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl shadow-sm transition-colors ${settings.showClassCode ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-200 text-zinc-500'}`}>
                  {settings.showClassCode ? <Eye size={20} /> : <EyeOff size={20} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-navy">Display Class Code</p>
                  <p className="text-[11px] text-zinc-500 font-medium">Students can see the join code</p>
                </div>
              </div>
              
              <button 
                type="button"
                disabled={isSaving}
                onClick={() => handleToggleSetting('showClassCode')}
                className={`w-14 h-7 rounded-full transition-all duration-300 relative ${
                  settings.showClassCode ? 'bg-emerald-500' : 'bg-zinc-300'
                } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-95'}`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ease-in-out ${
                  settings.showClassCode ? 'left-8' : 'left-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-zinc-50/80 border-t border-zinc-100 flex gap-3">
          <button type="button" onClick={onClose} disabled={isSaving} className="flex-1 px-4 py-3 rounded-xl font-bold text-zinc-600 hover:bg-zinc-200 transition-all disabled:opacity-50">
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving || !name.trim()}
            className="flex-1 px-4 py-3 rounded-xl font-bold bg-navy text-accent hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{isSaving ? "Updating..." : "Save Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
