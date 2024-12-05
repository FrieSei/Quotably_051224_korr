"use client"

import { Card } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface MetricsChartProps {
  data: Record<string, number[]>
}

export function MetricsChart({ data }: MetricsChartProps) {
  const chartData = data.successRate.map((_, index) => ({
    time: -index * 5,
    successRate: data.successRate[index] * 100,
    errorRate: data.errorRate[index] * 100,
    latency: data.latency[index]
  }))

  return (
    <Card className="p-4">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            label={{ value: 'Time (seconds ago)', position: 'insideBottom', offset: -5 }}
          />
          <YAxis yAxisId="rate" domain={[0, 100]} label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="latency" orientation="right" domain={['auto', 'auto']} label={{ value: 'Latency (ms)', angle: 90, position: 'insideRight' }} />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="rate"
            type="monotone"
            dataKey="successRate"
            stroke="hsl(var(--chart-1))"
            name="Success Rate"
          />
          <Line
            yAxisId="rate"
            type="monotone"
            dataKey="errorRate"
            stroke="hsl(var(--chart-2))"
            name="Error Rate"
          />
          <Line
            yAxisId="latency"
            type="monotone"
            dataKey="latency"
            stroke="hsl(var(--chart-3))"
            name="Latency"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}