"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { X, Settings, Save, Loader2, Eye, EyeOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureButton, ConfirmModal } from "@/components/ui";
import { useClassSettings } from "@/lib/hooks";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: any; 
}

export default function ClassSettingsModal({ isOpen, onClose, classData }: ModalProps) {
  const {
    name, setName,
    description, setDescription,
    settings, handleToggleSetting,
    isSaving, isDeleting,
    showDeleteConfirm, setShowDeleteConfirm,
    handleSave, handleDelete
  } = useClassSettings(isOpen, onClose, classData);

  if (!isOpen) return null;
  
  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-navy/40 backdrop-blur-sm" 
          onClick={() => !isSaving && !isDeleting && onClose()} 
        />
        
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
            <h2 className="text-xl font-bold text-navy flex items-center gap-2">
              <Settings size={20} className="text-secondary" /> 
              Class Settings
            </h2>
            <Button 
              variant="ghost"
              size="sm"
              onClick={onClose} 
              disabled={isSaving || isDeleting} 
              className="p-2 h-auto w-auto hover:bg-zinc-200 rounded-full text-zinc-500"
            >
              <X size={20} />
            </Button>
          </div>

          {/* Scrollable Content */}
          <div className="p-8 space-y-8 overflow-y-auto no-scrollbar">
            <div className="space-y-4">
              <h3 className="text-xs font-black text-navy/30 uppercase tracking-[0.2em]">General Info</h3>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Class Name</label>
                <input 
                  type="text" 
                  value={name}
                  placeholder="Enter class name..."
                  disabled={isSaving || isDeleting}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 text-navy font-medium rounded-xl border border-zinc-200 focus:ring-2 focus:ring-navy outline-none transition-all disabled:bg-zinc-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Description</label>
                <textarea 
                  rows={2}
                  value={description}
                  placeholder="Add a description..."
                  disabled={isSaving || isDeleting}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 text-navy font-medium rounded-xl border border-zinc-200 focus:ring-2 focus:ring-navy outline-none transition-all resize-none disabled:bg-zinc-50"
                />
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-100">
              <h3 className="text-xs font-black text-navy/30 uppercase tracking-[0.2em]">Privacy Settings</h3>
              
              <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-100 transition-all">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-2.5 rounded-xl shadow-sm transition-colors",
                    settings.showClassCode ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-200 text-zinc-500'
                  )}>
                    {settings.showClassCode ? <Eye size={20} /> : <EyeOff size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy">Display Class Code</p>
                    <p className="text-[11px] text-zinc-500 font-medium">Students can see the join code</p>
                  </div>
                </div>
                
                <Button 
                  key="toggle-code"
                  type="button"
                  variant="ghost"
                  disabled={isSaving || isDeleting}
                  onClick={() => handleToggleSetting('showClassCode')}
                  className={cn(
                    "w-14 h-7 p-0 rounded-full transition-all duration-300 relative border-none",
                    settings.showClassCode ? 'bg-emerald-500' : 'bg-zinc-300',
                    (isSaving || isDeleting) ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-95'
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ease-in-out",
                    settings.showClassCode ? 'left-8' : 'left-1'
                  )} />
                </Button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="space-y-4 pt-6 border-t border-red-100">
              <h3 className="text-xs font-black text-red-500 uppercase tracking-[0.2em]">Danger Zone</h3>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSaving || isDeleting}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-red-50 border border-red-100 hover:bg-red-100 transition-all group h-auto"
              >
                <div className="text-left">
                  <p className="text-sm font-bold text-red-600">Delete this class</p>
                  <p className="text-[11px] text-red-400 font-medium">Permanently remove all classroom data</p>
                </div>
                <Trash2 size={18} className="text-red-400 group-hover:text-red-600 transition-colors" />
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-zinc-50/80 border-t border-zinc-100 flex flex-col-reverse sm:flex-row gap-3">
            <Button 
              variant="secondary"
              onClick={onClose} 
              disabled={isSaving || isDeleting} 
              className="w-full sm:flex-1 py-3 rounded-xl border border-zinc-200"
            >
              Cancel
            </Button>
            <FeatureButton 
              onClick={handleSave}
              loading={isSaving}
              disabled={isDeleting || !name.trim()}
              label={isSaving ? "Updating..." : "Save Changes"}
              variant="yellow"
              icon={Save}
              className="w-full sm:flex-1 py-3 rounded-xl shadow-md"
            />
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete class?"
        message={`Are you sure you want to delete "${classData?.name}"? All assignments, materials, and student progress will be permanently removed. This action cannot be undone.`}
        confirmLabel="Delete Permanently"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
