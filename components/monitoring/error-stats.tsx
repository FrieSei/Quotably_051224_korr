"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { errorTracker } from '@/lib/monitoring/error-tracker'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export function ErrorStats() {
  const [stats, setStats] = useState<Record<string, any>>({})

  useEffect(() => {
    const updateStats = () => {
      setStats(errorTracker.getErrorStats())
    }

    updateStats()
    const interval = setInterval(updateStats, 5000)
    return () => clearInterval(interval)
  }, [])

  const providerData = Object.entries(stats.byProvider || {}).map(([name, value]) => ({
    name,
    errors: value,
  }))

  return (
    <Card className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Error Statistics</h3>
        <p className="text-sm text-muted-foreground">
          Total Errors: {stats.totalErrors || 0}
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={providerData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="errors" fill="hsl(var(--destructive))" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}