import { CircuitBreaker } from '@/lib/utils/circuit-breaker';
import { logger } from '@/lib/monitoring/logger';
import { metrics } from '@/lib/monitoring/metrics';
import { MetadataProvider, MetadataQuery, MetadataResult } from '@/lib/types';

export class ProviderManager {
  private circuitBreakers = new Map<string, CircuitBreaker>();
  private providers: MetadataProvider[] = [];

  constructor(providers: MetadataProvider[]) {
    this.providers = providers;
    this.initializeCircuitBreakers();
  }

  private initializeCircuitBreakers() {
    for (const provider of this.providers) {
      this.circuitBreakers.set(provider.name, new CircuitBreaker({
        failureThreshold: 5,
        resetTimeout: 30000, // 30 seconds
      }));
    }
  }

  async fetchMetadata(query: MetadataQuery): Promise<MetadataResult> {
    const errors: string[] = [];
    const startTime = Date.now();

    for (const provider of this.providers) {
      const breaker = this.circuitBreakers.get(provider.name);
      if (!breaker) continue;

      if (breaker.getState() === 'OPEN') {
        logger.warn(`Circuit breaker OPEN for provider: ${provider.name}`);
        continue;
      }

      try {
        const result = await breaker.execute(() => provider.fetchMetadata(query));
        
        // Record metrics
        const duration = Date.now() - startTime;
        metrics.record(`provider.${provider.name}.duration`, duration);
        metrics.increment(`provider.${provider.name}.success`);

        if (result.success) {
          logger.info(`Metadata fetch successful`, {
            provider: provider.name,
            duration,
            query
          });
          return result;
        }

        errors.push(`${provider.name}: ${result.error}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`${provider.name}: ${errorMessage}`);
        
        metrics.increment(`provider.${provider.name}.error`);
        logger.error(`Provider error`, {
          provider: provider.name,
          error: errorMessage,
          query
        });
      }
    }

    return {
      success: false,
      source: 'ProviderManager',
      error: `All providers failed: ${errors.join('; ')}`
    };
  }

  getProviderHealth(): Record<string, any> {
    return Object.fromEntries(
      this.providers.map(provider => {
        const breaker = this.circuitBreakers.get(provider.name);
        const errorRate = metrics.getAverage(`provider.${provider.name}.error`);
        const avgDuration = metrics.getAverage(`provider.${provider.name}.duration`);

        return [provider.name, {
          state: breaker?.getState(),
          failures: breaker?.getFailures(),
          errorRate,
          avgDuration
        }];
      })
    );
  }
}