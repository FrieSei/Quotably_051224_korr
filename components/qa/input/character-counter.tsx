"use client"

import { cn } from "@/lib/utils"

interface CharacterCounterProps {
  current: number
  max: number
}

export function CharacterCounter({ current, max }: CharacterCounterProps) {
  const remaining = max - current
  
  return (
    <span className={cn(
      "text-sm transition-colors",
      remaining < max * 0.1 && "text-yellow-500",
      remaining === 0 && "text-red-500"
    )}>
      {remaining} characters remaining
    </span>
  )
}