'use client'

import { Card, CardContent } from '@/components/ui/card'

export default function SidebarCard({
  title,
  children,
  extra,
}: {
  title: string
  children: React.ReactNode
  extra?: React.ReactNode
}) {
  return (
    <Card className="rounded-2xl shadow-sm bg-white">
      <CardContent className="p-5">
        <div className="flex justify-between mb-3">
          <span className="text-sm font-bold text-gray-700">{title}</span>
          {extra}
        </div>
        {children}
      </CardContent>
    </Card>
  )
}
