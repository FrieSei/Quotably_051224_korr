"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardHeader } from "@/components/ui/card"
import type { HeaderProps } from "./types"

export function ResultHeader({ title, timestamp, onDismiss }: HeaderProps) {
  return (
    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
      <div className="space-y-1">
        <h3 className="font-semibold leading-none">{title}</h3>
        <p className="text-sm text-muted-foreground">{timestamp}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onDismiss}
      >
        <X className="h-4 w-4" />
      </Button>
    </CardHeader>
  )
}