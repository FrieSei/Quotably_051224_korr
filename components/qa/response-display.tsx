"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Share2, ThumbsUp } from "lucide-react"
import { useQAStore } from "@/lib/store/qa-store"
import { motion, AnimatePresence } from "framer-motion"

export function ResponseDisplay() {
  const { response, isProcessing } = useQAStore()

  if (isProcessing) {
    return (
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm">Processing your question...</p>
        </div>
      </Card>
    )
  }

  if (!response) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card className="p-4 space-y-4">
          <p className="text-sm">{response.text}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {response.audioUrl && (
                <Button size="sm" variant="outline">
                  <Play className="mr-2 h-4 w-4" />
                  Play Response
                </Button>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button size="icon" variant="ghost">
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}