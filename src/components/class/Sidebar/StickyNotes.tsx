'use client'

import { useState, useTransition, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import SidebarCard from './Sidebar'
import {
  getStickyNotes,
  addStickyNote,
  clearStickyNotes,
} from '@/components/class/actions'

interface Note {
  id: string
  content: string
  created_at: string
}

interface StickyNotesProps {
  classId: string
}

export default function StickyNotes({ classId }: StickyNotesProps) {
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

  return (
    <SidebarCard
      title="Sticky Notes"
      extra={
        notes.length > 0 && (
          <Button
            variant="ghost"
            onClick={handleClearNotes}
            className="text-red-400 hover:text-red-500"
          >
            <X size={16} />
          </Button>
        )
      }
    >
      <textarea
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder="Write a note..."
        className="w-full min-h-[70px] text-xs resize-none outline-none bg-transparent border rounded-lg p-2"
      />

      <Button
        onClick={handleAddNote}
        disabled={!noteText.trim()}
        className="w-full mt-2 rounded-lg"
      >
        Add Note
      </Button>

      {notes.length === 0 ? (
        <p className="mt-2 text-xs text-gray-400 italic">No notes yet</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {notes.map((note) => (
            <li key={note.id} className="text-xs bg-yellow-50 border rounded-lg p-2">
              {note.content}
            </li>
          ))}
        </ul>
      )}

      {isPending && <p className="text-[10px] text-gray-400 mt-1">Saving…</p>}
    </SidebarCard>
  )
}
