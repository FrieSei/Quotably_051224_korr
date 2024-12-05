"use client"

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, X } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ErrorType } from '@/lib/types'
import { ERROR_MESSAGES } from '@/lib/constants/detection'

interface ErrorHandlerProps {
  error: ErrorType | null
  onDismiss: () => void
}

export function ErrorHandler({ error, onDismiss }: ErrorHandlerProps) {
  useEffect(() => {
    if (error) {
      const timer = setTimeout(onDismiss, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, onDismiss])

  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 max-w-md w-full mx-4"
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{ERROR_MESSAGES[error]}</AlertDescription>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={onDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  )
}