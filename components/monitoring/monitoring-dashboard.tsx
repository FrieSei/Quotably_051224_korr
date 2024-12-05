"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProviderHealth } from './provider-health'
import { MetricsChart } from './metrics-chart'
import { ErrorLog } from './error-log'
import { ErrorStats } from './error-stats'
import { metrics } from '@/lib/monitoring/metrics'
import { logger } from '@/lib/monitoring/logger'
import { metadataService } from '@/lib/services/metadata/metadata-service'

export function MonitoringDashboard() {
  const [activeTab, setActiveTab] = useState('health')
  const [healthData, setHealthData] = useState<Record<string, any>>({})
  const [metricsData, setMetricsData] = useState<Record<string, number[]>>({})

  useEffect(() => {
    const updateData = () => {
      setHealthData(metadataService.getProviderHealth())
      setMetricsData({
        successRate: Object.values(metrics.getMetric('provider.*.success') || {}),
        errorRate: Object.values(metrics.getMetric('provider.*.error') || {}),
        latency: Object.values(metrics.getMetric('provider.*.duration') || {})
      })
    }

    updateData()
    const interval = setInterval(updateData, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">System Monitor</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="health">Provider Health</TabsTrigger>
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          <TabsTrigger value="errors">Error Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="mt-4">
          <ProviderHealth data={healthData} />
        </TabsContent>

        <TabsContent value="metrics" className="mt-4">
          <MetricsChart data={metricsData} />
        </TabsContent>

        <TabsContent value="errors" className="mt-4 space-y-6">
          <ErrorStats />
          <ErrorLog />
        </TabsContent>
      </Tabs>
    </div>
  )
}