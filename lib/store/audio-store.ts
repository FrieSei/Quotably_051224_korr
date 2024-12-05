import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface AudioState {
  isRecording: boolean
  audioBlob: Blob | null
  audioLevel: number
  setIsRecording: (isRecording: boolean) => void
  setAudioBlob: (blob: Blob | null) => void
  setAudioLevel: (level: number) => void
}

export const useAudioStore = create<AudioState>()(
  devtools(
    (set) => ({
      isRecording: false,
      audioBlob: null,
      audioLevel: 0,
      setIsRecording: (isRecording) => set({ isRecording }),
      setAudioBlob: (audioBlob) => set({ audioBlob }),
      setAudioLevel: (audioLevel) => set({ audioLevel }),
    }),
    { name: 'AudioStore' }
  )
)