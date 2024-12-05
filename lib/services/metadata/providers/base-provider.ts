import { MetadataProvider, MetadataQuery, MetadataResult } from '@/lib/types';
import { cache } from '@/lib/utils/cache';
import { rateLimiter } from '@/lib/utils/rate-limiter';

export abstract class BaseMetadataProvider implements MetadataProvider {
  abstract name: string;
  abstract priority: number;
  abstract supportedTypes: ('podcast' | 'audiobook')[];
  protected abstract fetchFromSource(query: MetadataQuery): Promise<MetadataResult>;

  async fetchMetadata(query: MetadataQuery): Promise<MetadataResult> {
    const cacheKey = this.getCacheKey(query);
    
    try {
      // Check cache first
      const cached = await cache.get<MetadataResult>(cacheKey);
      if (cached) {
        return cached;
      }

      // Apply rate limiting and fetch from source
      const result = await rateLimiter.execute(
        this.name.toLowerCase(),
        () => this.fetchFromSource(query)
      );

      // Cache successful results
      if (result.success) {
        await cache.set(cacheKey, result, 3600); // Cache for 1 hour
      }

      return result;
    } catch (error) {
      return {
        success: false,
        source: this.name,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  protected getCacheKey(query: MetadataQuery): string {
    const queryString = JSON.stringify({
      provider: this.name,
      ...query
    });
    return `metadata:${queryString}`;
  }
}