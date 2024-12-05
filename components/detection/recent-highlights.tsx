"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Highlight } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { db } from "@/lib/db"
import { Play, Headphones, Clock, Radio } from "lucide-react"
import { cn } from "@/lib/utils"

export function RecentHighlights() {
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    const loadRecentHighlights = async () => {
      const database = await db
      const tx = database.transaction('highlights', 'readonly')
      const store = tx.objectStore('highlights')
      const items = await store.getAll()
      setHighlights(items.slice(-5).reverse())
    }

    loadRecentHighlights()
    
    const interval = setInterval(loadRecentHighlights, 30000)
    return () => clearInterval(interval)
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border/50">
      <ScrollArea className="h-52 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground/70">Recent Activity</h3>
          </div>
          <span className="text-xs text-muted-foreground">
            {highlights.length} captures
          </span>
        </div>
        
        <AnimatePresence>
          {highlights.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <Headphones className="w-8 h-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                No recent highlights yet
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Start listening to capture moments
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-2"
            >
              {highlights.map((highlight) => (
                <motion.div
                  layout
                  key={highlight.id}
                  variants={item}
                  className={cn(
                    "group relative bg-card hover:bg-accent rounded-lg p-3 shadow-sm transition-all duration-200",
                    "cursor-pointer border border-border/50 hover:border-border",
                    expandedId === highlight.id && "bg-accent"
                  )}
                  onClick={() => setExpandedId(expandedId === highlight.id ? null : highlight.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden bg-muted">
                      {highlight.metadata?.artwork ? (
                        <img
                          src={highlight.metadata.artwork}
                          alt={highlight.metadata.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Radio className="w-6 h-6 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2">
                        {highlight.content}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(highlight.timestamp, { addSuffix: true })}
                        </span>
                        {highlight.metadata?.title && (
                          <span className="text-xs text-muted-foreground/70">
                            • {highlight.metadata.title}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-4 h-4 text-foreground/70" />
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {expandedId === highlight.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 pt-2 border-t border-border/50"
                      >
                        {highlight.metadata && (
                          <div className="mb-2">
                            {highlight.metadata.episode && (
                              <p className="text-sm text-foreground/80">
                                {highlight.metadata.episode}
                              </p>
                            )}
                            {highlight.metadata.publisher && (
                              <p className="text-xs text-muted-foreground">
                                {highlight.metadata.publisher}
                              </p>
                            )}
                          </div>
                        )}
                        {highlight.notes && (
                          <p className="text-xs text-muted-foreground">
                            {highlight.notes}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </div>
  )
}