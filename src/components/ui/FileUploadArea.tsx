/**
 * @file FileUploadArea.tsx
 * @description A reusable drag-and-drop file upload component.
 * Supports multiple file selection, removal, and displays selected files.
 */
"use client";

import { UploadCloud, Paperclip, X } from "lucide-react";

interface FileUploadAreaProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  label?: string;
  multiple?: boolean;
  variant?: 'sm' | 'lg';
  onValidate?: (file: File) => boolean;
}

export function FileUploadArea({
  files,
  onFilesChange,
  label = "Attachments",
  multiple = true,
  variant = 'sm',
  onValidate,
}: FileUploadAreaProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      let selected = Array.from(e.target.files);
      if (onValidate) {
        selected = selected.filter(onValidate);
      }
      onFilesChange([...files, ...selected]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    onFilesChange(files.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && variant === 'sm' && (
        <label className="text-[11px] font-bold tracking-[.18em] uppercase text-navy">
          {label}
        </label>
      )}
      
      <label className={`relative cursor-pointer transition-all ${
        variant === 'sm' 
          ? "flex items-center gap-3 border-2 border-dashed border-border rounded-xl px-4 h-12 hover:border-navy/30 hover:bg-secondary/50" 
          : "flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border/60 rounded-2xl py-10 hover:border-navy/30 hover:bg-navy/5 bg-gray-50/30 group"
      }`}>
        {variant === 'sm' ? (
          <>
            <UploadCloud size={15} className="text-muted-foreground" />
            <span className="text-[13px] text-muted-foreground">Upload files</span>
          </>
        ) : (
          <>
            <div className="size-12 rounded-full bg-navy/5 flex items-center justify-center text-navy group-hover:scale-110 transition">
              <UploadCloud size={24} />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-foreground">Click or drag to upload</p>
              <p className="text-[11px] text-muted-foreground mt-1">Select files from your device</p>
            </div>
          </>
        )}
        
        <input
          type="file"
          multiple={multiple}
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleFileChange}
        />
      </label>

      {files.length > 0 && (
        <div className={`flex flex-wrap gap-2 ${variant === 'sm' ? 'mt-1' : 'pt-3'}`}>
          {files.map((file, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2 bg-secondary border border-border rounded-lg px-3 py-1.5 text-[12px] font-medium"
            >
              <Paperclip size={11} className="text-navy" />
              <span className="truncate max-w-[140px]">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="text-muted-foreground hover:text-red-500 transition cursor-pointer bg-transparent border-none"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
