"use client"

import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import { useQAStore } from "@/lib/store/qa-store"

export function QAButton() {
  const { isEnabled, openQA } = useQAStore()

  return (
    <Button
      size="lg"
      className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg"
      disabled={!isEnabled}
      onClick={openQA}
    >
      <HelpCircle className="h-6 w-6" />
      <span className="sr-only">Ask a question</span>
    </Button>
  )
}