"use client"

import { Card } from '@/components/ui/card'
import { CircleSlash, CheckCircle2, AlertCircle } from 'lucide-react'

interface ProviderHealthProps {
  data: Record<string, any>
}

export function ProviderHealth({ data }: ProviderHealthProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(data).map(([provider, health]) => (
        <Card key={provider} className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">{provider}</h3>
            {health.state === 'CLOSED' ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : health.state === 'HALF_OPEN' ? (
              <AlertCircle className="w-5 h-5 text-yellow-500" />
            ) : (
              <CircleSlash className="w-5 h-5 text-red-500" />
            )}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span>{health.state}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Failures:</span>
              <span>{health.failures}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Error Rate:</span>
              <span>{(health.errorRate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg. Latency:</span>
              <span>{health.avgDuration.toFixed(0)}ms</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}