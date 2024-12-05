"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { VoiceInput } from "./voice-input"
import { CharacterCounter } from "./character-counter"

interface QuestionInputProps {
  onSubmit: (question: string) => Promise<void>
  disabled?: boolean
  maxLength?: number
}

export function QuestionInput({ 
  onSubmit, 
  disabled = false,
  maxLength = 280 
}: QuestionInputProps) {
  const [question, setQuestion] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async () => {
    if (!question.trim() || isProcessing) return
    
    setIsProcessing(true)
    try {
      await onSubmit(question)
      setQuestion("")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleVoiceInput = (text: string) => {
    setQuestion((prev) => {
      const newText = prev + (prev ? " " : "") + text
      return newText.slice(0, maxLength)
    })
  }

  return (
    <div className="space-y-2">
      <Textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask anything about what you just heard..."
        className="min-h-[100px]"
        maxLength={maxLength}
        disabled={disabled || isProcessing}
      />
      <div className="flex items-center justify-between">
        <CharacterCounter current={question.length} max={maxLength} />
        <div className="space-x-2">
          <VoiceInput 
            onTranscript={handleVoiceInput}
            disabled={disabled || isProcessing}
          />
          <Button
            size="icon"
            disabled={!question.trim() || disabled || isProcessing}
            onClick={handleSubmit}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}