"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { ResultHeader } from "./header"
import { ResultContent } from "./content"
import type { ResultCardProps } from "./types"

export function ResultCard({
  title,
  episode,
  timestamp,
  onDismiss,
  onTimeAdjust,
  onShare
}: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed left-1/2 transform -translate-x-1/2 mt-6 w-[90%] max-w-md"
      style={{ top: "calc(50% + 160px)" }}
    >
      <Card className="shadow-lg border-border/50">
        <ResultHeader
          title={title}
          timestamp={timestamp}
          onDismiss={onDismiss}
        />
        <ResultContent
          episode={episode}
          onTimeAdjust={onTimeAdjust}
          onShare={onShare}
        />
      </Card>
    </motion.div>
  )
}