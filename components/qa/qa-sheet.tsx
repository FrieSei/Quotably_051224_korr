"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useQAStore } from "@/lib/store/qa-store"
import { TranscriptViewer } from "./transcript-viewer"
import { ResponseDisplay } from "./response-display"
import { QuestionInput } from "./input/question-input"

export function QASheet() {
  const { isOpen, closeQA, context, askQuestion } = useQAStore()

  return (
    <Sheet open={isOpen} onOpenChange={closeQA}>
      <SheetContent side="bottom" className="h-[90vh]">
        <SheetHeader>
          <SheetTitle>Ask about what you heard</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <TranscriptViewer transcript={context?.transcriptSegment} />
          <QuestionInput onSubmit={askQuestion} />
          <ResponseDisplay />
        </div>
      </SheetContent>
    </Sheet>
  )
}