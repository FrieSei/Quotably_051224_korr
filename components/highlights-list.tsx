"use client"

import { useHighlights } from '@/lib/hooks/use-highlights'
import { HighlightCard } from '@/components/highlight-card'

export function HighlightsList() {
  const { highlights } = useHighlights()

  if (highlights.length === 0) {
    return (
      <div className="text-center text-muted-foreground mt-8">
        No highlights yet. Start recording to create some!
      </div>
    )
  }

  return (
    <div className="grid gap-4 mt-8">
      {highlights.map((highlight) => (
        <HighlightCard key={highlight.id} highlight={highlight} />
      ))}
    </div>
  )
}