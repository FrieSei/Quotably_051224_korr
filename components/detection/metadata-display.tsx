"use client"

import { PodcastMetadata } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Disc3, Radio } from "lucide-react"
import { motion } from "framer-motion"

interface MetadataDisplayProps {
  metadata?: PodcastMetadata
  isLoading?: boolean
  className?: string
}

export function MetadataDisplay({ metadata, isLoading, className }: MetadataDisplayProps) {
  if (isLoading) {
    return (
      <div className={cn("flex flex-col items-center space-y-4", className)}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Disc3 className="w-12 h-12 text-primary/50" />
        </motion.div>
        <p className="text-sm text-muted-foreground">Fetching podcast info...</p>
      </div>
    )
  }

  if (!metadata) {
    return (
      <div className={cn("flex flex-col items-center space-y-4", className)}>
        <Radio className="w-12 h-12 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">Unknown audio source</p>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col items-center space-y-4", className)}>
      <div className="relative w-24 h-24 rounded-lg overflow-hidden">
        {metadata.artwork ? (
          <img
            src={metadata.artwork}
            alt={metadata.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Radio className="w-8 h-8 text-muted-foreground/50" />
          </div>
        )}
      </div>
      <div className="text-center">
        <h3 className="font-medium">{metadata.title}</h3>
        {metadata.episode && (
          <p className="text-sm text-muted-foreground mt-1">{metadata.episode}</p>
        )}
        {metadata.publisher && (
          <p className="text-xs text-muted-foreground/70 mt-0.5">
            {metadata.publisher}
          </p>
        )}
      </div>
    </div>
  )
}