"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Rewind } from "lucide-react"

interface TimeAdjusterProps {
  onAdjust: (seconds: number) => void
}

export function TimeAdjuster({ onAdjust }: TimeAdjusterProps) {
  const timeIntervals = [-45, -30, -15]

  return (
    <div className="flex justify-between gap-2">
      {timeIntervals.map((seconds, index) => (
        <motion.div
          key={seconds}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex-1"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => onAdjust(seconds)}
            className="w-full min-h-[44px] hover:bg-primary/5 transition-colors"
          >
            <Rewind className="h-4 w-4 mr-2" />
            {Math.abs(seconds)}s
          </Button>
        </motion.div>
      ))}
    </div>
  )
}