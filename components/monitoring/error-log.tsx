"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDistanceToNow } from 'date-fns'
import { AlertCircle } from 'lucide-react'

interface LogEntry {
  timestamp: string
  level: string
  message: string
  context?: Record<string, any>
}

export function ErrorLog() {
  const [logs, setLogs] = useState<LogEntry[]>([])

  useEffect(() => {
    const loadLogs = () => {
      const storedLogs = JSON.parse(localStorage.getItem('quotably_logs') || '[]')
      setLogs(storedLogs.filter((log: LogEntry) => log.level === 'error'))
    }

    loadLogs()
    const interval = setInterval(loadLogs, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="p-4">
      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {logs.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
              <p>No errors logged</p>
            </div>
          ) : (
            logs.map((log, index) => (
              <div
                key={index}
                className="p-3 bg-destructive/10 rounded-lg border border-destructive/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-destructive">
                    {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                  </span>
                  {log.context?.provider && (
                    <span className="text-xs text-muted-foreground">
                      {log.context.provider}
                    </span>
                  )}
                </div>
                <p className="text-sm">{log.message}</p>
                {log.context && (
                  <pre className="mt-2 text-xs text-muted-foreground overflow-x-auto">
                    {JSON.stringify(log.context, null, 2)}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  )
}