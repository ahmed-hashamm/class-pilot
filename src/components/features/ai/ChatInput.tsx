/**
 * @file ChatInput.tsx
 * @description Input component for the Class Chat, including suggested questions and the input field.
 */
'use client'

import { Input } from '@/components/ui/input'
import { Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SUGGESTED_QUESTIONS = [
  'Latest announcements?',
  'Next deadline?',
  'Active polls?',
  'Uploaded materials?'
]

interface ChatInputProps {
  classNameString: string;
  input: string;
  setInput: (value: string) => void;
  sendMessage: (text?: string) => void;
  loading: boolean;
  clearing: boolean;
}

export function ChatInput({
  classNameString,
  input,
  setInput,
  sendMessage,
  loading,
  clearing
}: ChatInputProps) {
  return (
    <div className="px-4 pb-3.5 pt-2 bg-white border-t border-border/60">
      <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar">
        {SUGGESTED_QUESTIONS.map((q) => (
          <Button
            key={q}
            variant="ghost"
            size="sm"
            onClick={() => sendMessage(q)}
            disabled={loading || clearing}
            className="whitespace-nowrap text-[10px] font-bold text-navy/40 bg-navy/[0.04]
                border border-navy/[0.08] rounded-lg px-2.5 py-1.5 h-auto
                hover:bg-navy/[0.08] hover:text-navy/60 hover:border-navy/15
                transition-all duration-150 active:scale-95"
          >
            {q}
          </Button>
        ))}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
        className="flex items-center gap-2"
      >
        <Input
          placeholder={`Ask about ${classNameString}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading || clearing}
          className="flex-1 bg-secondary border-transparent text-[13px] h-9 rounded-xl px-3.5
            focus-visible:ring-1 focus-visible:ring-navy/15
            placeholder:text-muted-foreground/35"
        />
        <Button
          type="submit"
          variant="primary"
          disabled={loading || clearing || !input.trim()}
          className="shrink-0 p-0 size-9 rounded-xl flex items-center justify-center  "
        >
          {loading
            ? <Loader2 className="size-3 animate-spin" />
            : <Send className="size-4" style={{ transform: 'translateX(1px)' }} />
          }
        </Button>
      </form>
    </div>
  );
}
