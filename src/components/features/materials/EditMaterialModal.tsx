'use client'

import { X, Paperclip, UploadCloud, Loader2, AlertCircle, FolderOpen } from 'lucide-react'
import { useEditMaterial } from '@/lib/hooks'
import { FeatureButton } from '@/components/ui/FeatureButton'
import { Button } from '@/components/ui/button'

interface ExistingFile {
    name: string
    url: string
    type?: string
}

interface Props {
    material: {
        id: string
        title: string
        description?: string
        files?: ExistingFile[]
        classId: string
    }
    onClose: () => void
    onSuccess: () => void
}

const inputClass = `w-full bg-white border border-border rounded-xl px-4 py-3
  text-[14px] text-foreground placeholder:text-muted-foreground
  focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition`

export default function EditMaterialModal({ material, onClose, onSuccess }: Props) {
    const {
        title, setTitle,
        description, setDescription,
        existingFiles, removeExistingFile,
        newFiles, setNewFiles, removeNewFile,
        loading, error,
        handleSave
    } = useEditMaterial(material, onClose, onSuccess);

    return (
        <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm flex items-center
      justify-center z-[100] p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-xl bg-navy flex items-center justify-center">
                            <FolderOpen size={13} className="text-yellow" />
                        </div>
                        <h3 className="font-black text-[17px] tracking-tight">Edit material</h3>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose} className="p-1.5">
                        <X size={16} />
                    </Button>
                </div>

                <div className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
                    {error && (
                        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200
              text-red-600 text-[13px] font-semibold px-4 py-3 rounded-xl">
                            <AlertCircle size={14} /> {error}
                        </div>
                    )}

                    {/* Title */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold tracking-[.18em] uppercase text-navy">
                            Title
                        </label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Material title"
                            className={inputClass}
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold tracking-[.18em] uppercase text-navy">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Optional notes about this material"
                            rows={3}
                            className={`${inputClass} resize-none`}
                        />
                    </div>

                    {/* Existing files */}
                    {existingFiles.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold tracking-[.18em] uppercase text-navy">
                                Current files
                            </label>
                            {existingFiles.map((file, i) => (
                                <div key={i} className="flex items-center justify-between bg-secondary
                  border border-border rounded-xl px-3 py-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Paperclip size={12} className="text-navy shrink-0" />
                                        <span className="text-[12px] font-medium truncate">{file.name}</span>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeExistingFile(i)}
                                        className="shrink-0 text-muted-foreground hover:text-red-500 hover:bg-red-50 p-1 h-auto w-auto ml-2">
                                        <X size={13} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add new files */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold tracking-[.18em] uppercase text-navy">
                            Add files
                        </label>
                        <label className="relative flex items-center gap-3 border-2 border-dashed
              border-border rounded-xl px-4 h-12 cursor-pointer hover:border-navy/30
              hover:bg-secondary/50 transition">
                            <UploadCloud size={15} className="text-muted-foreground" />
                            <span className="text-[13px] text-muted-foreground">Click to upload</span>
                            <input
                                type="file" multiple
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) =>
                                    e.target.files && setNewFiles([...newFiles, ...Array.from(e.target.files)])
                                }
                            />
                        </label>

                        {newFiles.length > 0 && (
                            <div className="flex flex-col gap-1.5">
                                {newFiles.map((file, i) => (
                                    <div key={i} className="flex items-center justify-between bg-white
                    border border-border rounded-xl px-3 py-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <Paperclip size={12} className="text-navy-light shrink-0" />
                                            <span className="text-[12px] font-medium truncate">{file.name}</span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeNewFile(i)}
                                            className="shrink-0 text-muted-foreground hover:text-red-500 hover:bg-red-50 p-1 h-auto w-auto ml-2">
                                            <X size={13} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 px-6 pb-6">
                    <Button onClick={onClose}
                        variant="ghost"
                        className="w-full sm:flex-1 py-3"
                    >
                        Cancel
                    </Button>
                    <FeatureButton
                        onClick={handleSave}
                        disabled={loading}
                        loading={loading}
                        loadingLabel="Saving…"
                        label="Save changes"
                        className="w-full sm:flex-1 py-3"
                    />
                </div>
            </div>
        </div>
    )
}
