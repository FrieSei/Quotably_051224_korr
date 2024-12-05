"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { ResultHeader } from "./result-header"
import { ResultContent } from "./result-content"
import { LibraryLink } from "./library-link"

interface ResultCardProps {
  title: string
  episode?: string
  timestamp: string
  audioUrl: string
  onDismiss: () => void
  onTimeAdjust: (seconds: number) => void
  isVisible: boolean
}

export function ResultCard({
  title,
  episode,
  timestamp,
  audioUrl,
  onDismiss,
  onTimeAdjust,
  isVisible
}: ResultCardProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-1/2 transform -translate-x-1/2 w-[90%] max-w-md"
            style={{ top: "calc(50% + 160px)" }}
          >
            <Card className="shadow-lg border-border/50 overflow-hidden">
              <ResultHeader 
                title={title}
                episode={episode}
                timestamp={timestamp}
                onDismiss={onDismiss}
              />
              <ResultContent
                audioUrl={audioUrl}
                onTimeAdjust={onTimeAdjust}
              />
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            <LibraryLink />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}