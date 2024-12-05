"use client"

import { useState, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { DetectionButton } from './detection-button'
import { DetectionState } from '@/lib/types'
import { cn } from '@/lib/utils'

interface DetectionCarouselProps {
  state: DetectionState
  onStateChange: (state: DetectionState) => void
  onAction: () => void
}

export function DetectionCarousel({ state, onStateChange, onAction }: DetectionCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, dragFree: false })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollTo = useCallback((index: number) => {
    emblaApi?.scrollTo(index)
    setSelectedIndex(index)
  }, [emblaApi])

  const handleNext = useCallback(() => {
    if (selectedIndex < 2) {
      scrollTo(selectedIndex + 1)
    }
  }, [selectedIndex, scrollTo])

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="relative w-full max-w-md overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {/* Listen State */}
          <div className="flex-[0_0_100%] min-w-0">
            <DetectionButton
              state={state}
              onClick={() => {
                onAction()
                if (state === "success") handleNext()
              }}
            />
          </div>
          
          {/* Ask State */}
          <div className="flex-[0_0_100%] min-w-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <button
                className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary hover:bg-primary/90 
                          flex items-center justify-center transition-all duration-300"
                onClick={() => {
                  onAction()
                  handleNext()
                }}
              >
                <span className="text-xl text-primary-foreground">Ask</span>
              </button>
            </motion.div>
          </div>
          
          {/* Share State */}
          <div className="flex-[0_0_100%] min-w-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <button
                className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary hover:bg-primary/90 
                          flex items-center justify-center transition-all duration-300"
                onClick={onAction}
              >
                <span className="text-xl text-primary-foreground">Share</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex space-x-2">
        {[0, 1, 2].map((idx) => (
          <button
            key={idx}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              selectedIndex === idx ? "bg-primary w-4" : "bg-primary/30"
            )}
            onClick={() => scrollTo(idx)}
          />
        ))}
      </div>

      {/* Next Button */}
      <AnimatePresence>
        {selectedIndex < 2 && state === "success" && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 right-4 p-2 rounded-full bg-primary/10 
                      hover:bg-primary/20 transition-colors duration-300"
            onClick={handleNext}
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}