import { useState, useTransition, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Plus, StickyNote, Loader2 } from 'lucide-react'
import SidebarCard from './SidebarCard'
import {
  getStickyNotes,
  addStickyNote,
  clearStickyNotes,
} from '@/actions/ClassActions'

interface Note {
  id: string
  content: string
  created_at: string
}

export default function StickyNotes({ classId }: { classId: string }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [noteText, setNoteText] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    getStickyNotes(classId).then(setNotes)
  }, [classId])

  function handleAddNote() {
    if (!noteText.trim()) return
    startTransition(async () => {
      await addStickyNote(classId, noteText)
      setNoteText('')
      setNotes(await getStickyNotes(classId))
    })
  }

  function handleClearNotes() {
    startTransition(async () => {
      await clearStickyNotes(classId)
      setNotes([])
    })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter') handleAddNote() //(e.metaKey || e.ctrlKey)
  }

  return (
    <SidebarCard
      title="Sticky Notes"
      extra={
        notes.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearNotes}
            className="h-auto p-0 text-xs text-red-400 hover:text-red-500 hover:bg-transparent"
          >

            Clear all
          </Button>
        )
      }
    >
      {/* Input area */}
      <div className="flex flex-col gap-2">
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a note…"
          rows={3}
          className="w-full resize-none text-[12px] bg-secondary border border-border
            rounded-xl p-2.5 text-foreground placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy
            transition leading-relaxed"
        />

        <Button
          onClick={handleAddNote}
          disabled={!noteText.trim() || isPending}
          className="w-full bg-navy text-white text-[12px] font-semibold py-2 rounded-xl h-auto"
        >
          {isPending
            ? <><Loader2 size={13} className="animate-spin" /> Saving...</>
            : <><Plus size={13} /> Add note</>
          }
        </Button>

        <p className="text-[10px] text-muted-foreground text-center">
          Tip: <kbd className="font-mono bg-secondary border border-border
            rounded px-1 py-0.5 text-[9px]">⌘ Enter</kbd> to add
        </p>
      </div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <div className="flex flex-col items-center gap-1.5 py-4 mt-1">
          <StickyNote size={20} className="text-muted-foreground/40" />
          <p className="text-[12px] text-muted-foreground italic">No notes yet</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2 mt-3">
          {notes.map((note) => (
            <li key={note.id}
              className="bg-yellow/20 border border-yellow/50 rounded-xl px-3 py-2.5">
              <p className="text-[12px] text-foreground leading-relaxed whitespace-pre-wrap">
                {note.content}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">
                {new Date(note.created_at).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </SidebarCard>
  )
}
