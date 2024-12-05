interface MetricValue {
  value: number;
  timestamp: number;
}

interface Metric {
  name: string;
  values: MetricValue[];
  maxSamples: number;
}

export class Metrics {
  private static instance: Metrics;
  private metrics: Map<string, Metric> = new Map();
  private readonly defaultMaxSamples = 100;

  private constructor() {
    this.setupPeriodicCleanup();
  }

  static getInstance(): Metrics {
    if (!Metrics.instance) {
      Metrics.instance = new Metrics();
    }
    return Metrics.instance;
  }

  increment(name: string, value: number = 1) {
    this.record(name, value);
  }

  record(name: string, value: number, maxSamples: number = this.defaultMaxSamples) {
    const metric = this.metrics.get(name) || {
      name,
      values: [],
      maxSamples
    };

    metric.values.push({
      value,
      timestamp: Date.now()
    });

    // Trim old values if needed
    if (metric.values.length > maxSamples) {
      metric.values = metric.values.slice(-maxSamples);
    }

    this.metrics.set(name, metric);
  }

  getMetric(name: string): Metric | undefined {
    return this.metrics.get(name);
  }

  getAverage(name: string, timeWindowMs: number = 60000): number {
    const metric = this.metrics.get(name);
    if (!metric) return 0;

    const now = Date.now();
    const relevantValues = metric.values.filter(
      v => now - v.timestamp <= timeWindowMs
    );

    if (relevantValues.length === 0) return 0;

    const sum = relevantValues.reduce((acc, v) => acc + v.value, 0);
    return sum / relevantValues.length;
  }

  private setupPeriodicCleanup() {
    setInterval(() => this.cleanup(), 300000); // Clean up every 5 minutes
  }

  private cleanup() {
    const now = Date.now();
    const oneHourAgo = now - 3600000;

    for (const [name, metric] of this.metrics.entries()) {
      metric.values = metric.values.filter(v => v.timestamp > oneHourAgo);
      if (metric.values.length === 0) {
        this.metrics.delete(name);
      }
    }
  }
}

export const metrics = Metrics.getInstance();