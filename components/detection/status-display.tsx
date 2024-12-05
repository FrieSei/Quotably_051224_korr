"use client"

import { DETECTION_STATES, ERROR_MESSAGES } from "@/lib/constants/detection"
import { DetectionState, ErrorType } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"

interface StatusDisplayProps {
  state: DetectionState
  errorType: ErrorType | null
}

export function StatusDisplay({ state, errorType }: StatusDisplayProps) {
  const displayText = state === "error" && errorType 
    ? ERROR_MESSAGES[errorType]
    : DETECTION_STATES[state].text

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state + (errorType || '')}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "text-center text-lg md:text-xl font-medium",
          state === "error" ? "text-destructive" : "text-foreground/80"
        )}
      >
        {displayText}
      </motion.div>
    </AnimatePresence>
  )
}