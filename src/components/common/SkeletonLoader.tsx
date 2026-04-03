'use client'

import React from 'react'

interface SkeletonLoaderProps {
  variant?: 'card' | 'list' | 'text' | 'form' | 'header'
  count?: number
}

/**
 * SkeletonLoader provides a premium loading state for the Class Pilot dashboard.
 * Use variants to match the expected content type.
 */
export function SkeletonLoader({ variant = 'card', count = 1 }: SkeletonLoaderProps) {
  const items = Array.from({ length: count })

  const CardSkeleton = () => (
    <div className="w-full bg-white border border-border rounded-2xl p-6 animate-pulse shadow-sm">
      <div className="flex gap-4 items-center mb-6">
        <div className="size-12 bg-secondary rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-secondary rounded w-1/3" />
          <div className="h-3 bg-secondary/60 rounded w-1/4" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-secondary rounded w-full" />
        <div className="h-3 bg-secondary rounded w-5/6" />
      </div>
    </div>
  )

  const ListSkeleton = () => (
    <div className="w-full space-y-3">
      {items.map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white border border-border rounded-xl animate-pulse shadow-sm">
          <div className="size-8 bg-secondary rounded-lg" />
          <div className="flex-1 h-4 bg-secondary rounded" />
          <div className="w-12 h-4 bg-secondary rounded" />
        </div>
      ))}
    </div>
  )

  const FormSkeleton = () => (
    <div className="space-y-6 animate-pulse bg-white p-8 border border-border rounded-3xl shadow-sm">
      <div className="space-y-2">
        <div className="h-3 bg-secondary rounded w-20" />
        <div className="h-10 bg-secondary rounded-xl w-full" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-secondary rounded w-20" />
        <div className="h-32 bg-secondary rounded-xl w-full" />
      </div>
    </div>
  )

  const HeaderSkeleton = () => (
    <div className="flex items-end justify-between w-full mb-8 animate-pulse">
      <div className="space-y-3">
        <div className="h-8 bg-secondary rounded-lg w-48" />
        <div className="h-4 bg-secondary rounded w-32" />
      </div>
      <div className="h-12 bg-secondary rounded-2xl w-32" />
    </div>
  )

  if (variant === 'list') return <ListSkeleton />
  if (variant === 'form') return <FormSkeleton />
  if (variant === 'header') return <HeaderSkeleton />
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((_, i) => <CardSkeleton key={i} />)}
    </div>
  )
}
