"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface ResultTranscriptProps {
  transcript: string
}

export function ResultTranscript({ transcript }: ResultTranscriptProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <CardContent>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between">
            Transcript
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <p className="text-sm text-muted-foreground">{transcript}</p>
        </CollapsibleContent>
      </Collapsible>
    </CardContent>
  )
}