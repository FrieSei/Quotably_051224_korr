import { DetectionState, DetectionStatus } from '@/lib/types'

export const DETECTION_STATES: Record<DetectionState, DetectionStatus> = {
  initial: {
    text: "Tap when you hear something interesting",
    buttonState: "ready",
    animation: "none"
  },
  listening: {
    text: "Listening...",
    buttonState: "active",
    animation: "pulse"
  },
  success: {
    text: "Ask anything about this moment",
    buttonState: "complete",
    animation: "fadeIn"
  },
  error: {
    text: "",
    buttonState: "error",
    animation: "shake",
    isError: true
  }
}

export const ERROR_MESSAGES = {
  silence: "No audio detected",
  permission: "Permission needed for microphone",
  processing: "Couldn't process audio"
}