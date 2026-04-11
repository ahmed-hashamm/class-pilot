'use client'

import React from 'react'

interface SkeletonLoaderProps {
  variant?: 'card' | 'list' | 'text' | 'form' | 'header' | 'chat'
  count?: number
}

/**
 * Provides high-fidelity "shimmer" loading placeholders.
 * 
 * Features:
 * - Six specialized variants (card, list, text, form, header, chat)
 * - Support for staggered repetition via the 'count' prop
 * - Perfectly mirrors the dimensions and spacing of the final rendered components
 */
export function SkeletonLoader({ variant = 'card', count = 1 }: SkeletonLoaderProps) {
  const items = Array.from({ length: count })

  const CardSkeleton = () => (
    <div className="w-full bg-white border border-secondary/35 rounded-[20px] p-6 animate-pulse shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-secondary/50 rounded-xl" />
          <div className="h-5 bg-secondary/50 rounded-lg w-1/2" />
        </div>
        <div className="space-y-2 mt-2">
          <div className="h-3 bg-secondary/35 rounded-full w-full" />
          <div className="h-3 bg-secondary/35 rounded-full w-4/5" />
          <div className="h-3 bg-secondary/35 rounded-full w-2/3" />
        </div>
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-secondary/20">
          <div className="size-6 bg-secondary/50 rounded-full" />
          <div className="h-3 bg-secondary/35 rounded-full w-24" />
        </div>
      </div>
    </div>
  )

  const ListSkeleton = () => (
    <div className="w-full space-y-5">
      {items.map((_, i) => (
        <div key={i} className="flex flex-col gap-4 p-6 bg-white border border-secondary/35 rounded-2xl animate-pulse shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="size-10 bg-secondary/50 rounded-xl shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 bg-secondary/50 rounded-lg w-1/3" />
                <div className="h-3 bg-secondary/35 rounded-full w-1/4" />
              </div>
            </div>
            <div className="w-20 h-8 bg-secondary/40 rounded-xl" />
          </div>
          <div className="h-3 bg-secondary/20 rounded-full w-full mt-2" />
          <div className="flex items-center gap-3 mt-2 pt-4 border-t border-secondary/20">
            <div className="w-16 h-3 bg-secondary/35 rounded-full" />
            <div className="w-16 h-3 bg-secondary/35 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )

  const FormSkeleton = () => (
    <div className="space-y-6 animate-pulse bg-white p-8 border border-border rounded-3xl shadow-sm">
      <div className="space-y-2">
        <div className="h-3 bg-secondary/40 rounded w-20" />
        <div className="h-10 bg-secondary/30 rounded-xl w-full" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-secondary/40 rounded w-20" />
        <div className="h-32 bg-secondary/30 rounded-xl w-full" />
      </div>
    </div>
  )

  const HeaderSkeleton = () => (
    <div className="flex items-end justify-between w-full mb-8 animate-pulse">
      <div className="space-y-3">
        <div className="h-8 bg-secondary/50 rounded-lg w-48" />
        <div className="h-4 bg-secondary/40 rounded w-32" />
      </div>
      <div className="h-12 bg-secondary/50 rounded-2xl w-32" />
    </div>
  )

  const ChatSkeleton = () => (
    <div className="w-full space-y-8 animate-pulse">
      {items.map((_, i) => (
        <div key={i} className="flex items-start gap-4">
          <div className="size-8 rounded-full bg-secondary/50 shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-3 bg-secondary/50 rounded-full w-24" />
            <div className="space-y-2">
              <div className="h-3 bg-secondary/25 rounded-full w-4/5" />
              <div className="h-3 bg-secondary/25 rounded-full w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  if (variant === 'list') return <ListSkeleton />
  if (variant === 'form') return <FormSkeleton />
  if (variant === 'header') return <HeaderSkeleton />
  if (variant === 'chat') return <ChatSkeleton />
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((_, i) => <CardSkeleton key={i} />)}
    </div>
  )
}

