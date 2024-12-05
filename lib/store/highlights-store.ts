import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Highlight } from '@/lib/types'

interface HighlightsState {
  highlights: Highlight[]
  selectedHighlightId: string | null
  setHighlights: (highlights: Highlight[]) => void
  setSelectedHighlightId: (id: string | null) => void
  addHighlight: (highlight: Highlight) => void
  removeHighlight: (id: string) => void
}

export const useHighlightsStore = create<HighlightsState>()(
  devtools(
    (set) => ({
      highlights: [],
      selectedHighlightId: null,
      setHighlights: (highlights) => set({ highlights }),
      setSelectedHighlightId: (id) => set({ selectedHighlightId: id }),
      addHighlight: (highlight) =>
        set((state) => ({
          highlights: [highlight, ...state.highlights].slice(0, 50) // Keep last 50 highlights
        })),
      removeHighlight: (id) =>
        set((state) => ({
          highlights: state.highlights.filter((h) => h.id !== id)
        })),
    }),
    { name: 'HighlightsStore' }
  )
)