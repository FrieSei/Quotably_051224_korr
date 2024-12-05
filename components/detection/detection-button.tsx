"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Mic, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { DetectionState } from "@/lib/types"
import { cn } from "@/lib/utils"

interface DetectionButtonProps {
  state: DetectionState
  onClick: () => void
}

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
  listening: {
    scale: [1, 1.1, 1],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: "easeInOut"
    }
  },
  error: {
    x: [-10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  }
}

const iconVariants = {
  initial: { opacity: 1, scale: 1 },
  listening: {
    scale: [1, 1.2, 1],
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "easeInOut"
    }
  }
}

export function DetectionButton({ state, onClick }: DetectionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          animate={state}
        >
          <Button
            onClick={onClick}
            size="lg"
            variant={state === "error" ? "destructive" : "default"}
            className={cn(
              "w-32 h-32 md:w-40 md:h-40 rounded-full",
              state === "listening" && "bg-destructive hover:bg-destructive/90",
              state === "success" && "bg-green-600 hover:bg-green-700"
            )}
          >
            <AnimatePresence mode="wait">
              {state === "error" ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <AlertCircle className="w-12 h-12 md:w-16 md:h-16" />
                </motion.div>
              ) : (
                <motion.div
                  key="mic"
                  variants={iconVariants}
                  initial="initial"
                  animate={state === "listening" ? "listening" : "initial"}
                >
                  <Mic className="w-12 h-12 md:w-16 md:h-16" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent>
        {state === "initial" && "Start listening"}
        {state === "listening" && "Stop recording"}
        {state === "success" && "Recording complete"}
        {state === "error" && "Error occurred"}
      </TooltipContent>
    </Tooltip>
  )
}