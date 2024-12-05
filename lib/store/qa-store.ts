"use client"

import { create } from "zustand"
import { QuestionContext, QAInteraction } from "@/lib/types"

interface QAState {
  isEnabled: boolean
  isOpen: boolean
  context: QuestionContext | null
  response: {
    text: string
    audioUrl?: string
  } | null
  isProcessing: boolean
  error?: string
  history: QAInteraction[]
  setEnabled: (enabled: boolean) => void
  openQA: () => void
  closeQA: () => void
  setContext: (context: QuestionContext) => void
  askQuestion: (question: string) => Promise<void>
  clearResponse: () => void
}

export const useQAStore = create<QAState>((set, get) => ({
  isEnabled: false,
  isOpen: false,
  context: null,
  response: null,
  isProcessing: false,
  history: [],
  
  setEnabled: (enabled) => set({ isEnabled: enabled }),
  openQA: () => set({ isOpen: true }),
  closeQA: () => set({ isOpen: false }),
  setContext: (context) => set({ context }),
  
  askQuestion: async (question) => {
    set({ isProcessing: true, error: undefined })
    
    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const response = {
        text: "This is a simulated response. Replace with actual API integration.",
        audioUrl: "/api/audio/response-123.mp3"
      }
      
      const interaction: QAInteraction = {
        id: Date.now().toString(),
        question,
        response,
        timestamp: Date.now(),
        context: get().context!
      }
      
      set(state => ({
        response,
        history: [interaction, ...state.history]
      }))
    } catch (error) {
      set({ error: "Failed to process question" })
    } finally {
      set({ isProcessing: false })
    }
  },
  
  clearResponse: () => set({ response: null })
}))