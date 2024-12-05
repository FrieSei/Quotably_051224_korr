import { MetadataProvider, MetadataQuery, MetadataResult } from '@/lib/types';
import { ListenNotesProvider } from './providers/listen-notes';
import { PodcastIndexProvider } from './providers/podcast-index';
import { AudibleProvider } from './providers/audible';
import { SpotifyProvider } from './providers/spotify';
import { Logger, logger } from '@/lib/logger';

interface ProviderConfig {
  listenNotes?: { apiKey: string };
  podcastIndex?: { key: string; secret: string };
  audible?: { apiKey: string };
  spotify?: { clientId: string; clientSecret: string };
}

class ProviderInitializationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProviderInitializationError';
  }
}

class ProviderExecutionError extends Error {
  constructor(public readonly provider: string, public readonly originalError: Error) {
    super(`Provider ${provider} failed: ${originalError.message}`);
    this.name = 'ProviderExecutionError';
  }
}

class MetadataServiceError extends Error {
  constructor(public readonly errors: Record<string, string>) {
    super('Metadata fetch failed');
    this.name = 'MetadataServiceError';
  }
}

export class MetadataService {
  private readonly providers: MetadataProvider[] = [];
  private readonly logger: Logger;
  
  constructor(config: ProviderConfig) {
    this.logger = logger;
    this.validateEnvVars(config);
    this.initializeProviders(config);
  }

  private validateEnvVars(config: ProviderConfig): void {
    if (!config.listenNotes?.apiKey) {
      this.logger.warn('Missing ListenNotes API key', { provider: 'ListenNotes' });
    }
    if (!config.podcastIndex?.key || !config.podcastIndex?.secret) {
      this.logger.warn('Missing PodcastIndex credentials', { provider: 'PodcastIndex' });
    }
    if (!config.audible?.apiKey) {
      this.logger.warn('Missing Audible API key', { provider: 'Audible' });
    }
    if (!config.spotify?.clientId || !config.spotify?.clientSecret) {
      this.logger.warn('Missing Spotify credentials', { provider: 'Spotify' });
    }
  }

  private initializeProviders(config: ProviderConfig): void {
    try {
      this.addListenNotesProvider(config.listenNotes);
      this.addPodcastIndexProvider(config.podcastIndex);
      this.addAudibleProvider(config.audible);
      this.addSpotifyProvider(config.spotify);
    } catch (error) {
      this.logger.error('Failed to initialize providers', { error });
      throw new ProviderInitializationError('Provider initialization failed');
    }
  }

  private addListenNotesProvider(config?: { apiKey: string }): void {
    if (config?.apiKey) {
      this.addProvider(new ListenNotesProvider(config.apiKey));
    } else {
      this.logger.warn('ListenNotes provider not initialized', { 
        reason: 'missing API key',
        provider: 'ListenNotes'
      });
    }
  }

  private addPodcastIndexProvider(config?: { key: string; secret: string }): void {
    if (config?.key && config?.secret) {
      this.addProvider(new PodcastIndexProvider(config.key, config.secret));
    } else {
      this.logger.warn('PodcastIndex provider not initialized', {
        reason: 'missing credentials',
        provider: 'PodcastIndex'
      });
    }
  }

  private addAudibleProvider(config?: { apiKey: string }): void {
    if (config?.apiKey) {
      this.addProvider(new AudibleProvider(config.apiKey));
    } else {
      this.logger.warn('Audible provider not initialized', {
        reason: 'missing API key',
        provider: 'Audible'
      });
    }
  }

  private addSpotifyProvider(config?: { clientId: string; clientSecret: string }): void {
    if (config?.clientId && config?.clientSecret) {
      this.addProvider(new SpotifyProvider(config.clientId, config.clientSecret));
    } else {
      this.logger.warn('Spotify provider not initialized', {
        reason: 'missing credentials',
        provider: 'Spotify'
      });
    }
  }

  private isValidPriority(priority: unknown): priority is number {
    return typeof priority === 'number' && !isNaN(priority);
  }

  private addProvider(provider: MetadataProvider): void {
    if (!this.isValidPriority(provider.priority)) {
      throw new ProviderInitializationError(`Invalid priority for provider ${provider.name}`);
    }
    this.providers.push(provider);
    this.providers.sort((a, b) => a.priority - b.priority);
  }

  async fetchMetadata(query: MetadataQuery): Promise<MetadataResult> {
    const relevantProviders = this.providers.filter(provider => 
      !query.type || provider.supportedTypes.includes(query.type)
    );

    if (relevantProviders.length === 0) {
      this.logger.error('No providers available for query type', { type: query.type });
      throw new Error(`No providers available for type: ${query.type}`);
    }

    const providerPromises = relevantProviders.map(async provider => {
      try {
        const result = await provider.fetchMetadata(query);
        if (result.success && result.data) {
          return { provider: provider.name, result };
        }
        throw new Error(result.error || 'Unknown error');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`Provider ${provider.name} failed`, { 
          error,
          query,
          provider: provider.name
        });
        throw new ProviderExecutionError(
          provider.name,
          error instanceof Error ? error : new Error(errorMessage)
        );
      }
    });

    const results = await Promise.allSettled(providerPromises);
    
    const successfulResult = results.find(
      (r): r is PromiseFulfilledResult<{provider: string; result: MetadataResult}> => 
        r.status === 'fulfilled'
    );

    if (successfulResult) {
      return successfulResult.value.result;
    }

    const errors: Record<string, string> = {};
    for (const result of results) {
      if (result.status === 'rejected') {
        errors[result.reason.provider] = result.reason.message;
      }
    }

    throw new MetadataServiceError(errors);
  }

  getProviders(): ReadonlyArray<MetadataProvider> {
    return [...this.providers];
  }
}

export const metadataService = new MetadataService({
  listenNotes: {
    apiKey: process.env.NEXT_PUBLIC_LISTEN_NOTES_API_KEY
  },
  podcastIndex: {
    key: process.env.NEXT_PUBLIC_PODCAST_INDEX_KEY,
    secret: process.env.NEXT_PUBLIC_PODCAST_INDEX_SECRET
  },
  audible: {
    apiKey: process.env.NEXT_PUBLIC_AUDIBLE_API_KEY
  },
  spotify: {
    clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET
  }
});