import { MetadataProvider, MetadataQuery, MetadataResult, ContentMetadata } from '@/lib/types';
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

class MetadataServiceError extends Error {
  constructor(public readonly errors: Record<string, string>) {
    super('Metadata fetch failed');
    this.name = 'MetadataServiceError';
  }
}

export class MetadataService {
  private readonly providers: MetadataProvider[] = [];
  private readonly logger: Logger;
  
  constructor(config: ProviderConfig, logger: Logger) {
    this.logger = logger;
    this.initializeProviders(config);
  }

  private initializeProviders(config: ProviderConfig): void {
    try {
      if (config.listenNotes?.apiKey) {
        this.addProvider(new ListenNotesProvider(config.listenNotes.apiKey));
      } else {
        this.logger.warn('ListenNotes provider not initialized: missing API key');
      }

      if (config.podcastIndex?.key && config.podcastIndex.secret) {
        this.addProvider(new PodcastIndexProvider(
          config.podcastIndex.key,
          config.podcastIndex.secret
        ));
      } else {
        this.logger.warn('PodcastIndex provider not initialized: missing credentials');
      }

      if (config.audible?.apiKey) {
        this.addProvider(new AudibleProvider(config.audible.apiKey));
      }

      if (config.spotify?.clientId && config.spotify.clientSecret) {
        this.addProvider(new SpotifyProvider(
          config.spotify.clientId,
          config.spotify.clientSecret
        ));
      }
    } catch (error) {
      this.logger.error('Failed to initialize providers', error);
      throw new Error('Provider initialization failed');
    }
  }

  private addProvider(provider: MetadataProvider): void {
    if (typeof provider.priority !== 'number') {
      throw new Error(`Invalid provider priority for ${provider.name}`);
    }
    this.providers.push(provider);
    this.providers.sort((a, b) => a.priority - b.priority);
  }

  async fetchMetadata(query: MetadataQuery): Promise<MetadataResult> {
    const relevantProviders = this.providers.filter(provider => 
      !query.type || provider.supportedTypes.includes(query.type)
    );

    if (relevantProviders.length === 0) {
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
        this.logger.error(`Provider ${provider.name} failed:`, error);
        throw new Error(`${provider.name}: ${errorMessage}`);
      }
    });

    try {
      const results = await Promise.allSettled(providerPromises);
      
      const successfulResult = results.find(
        (r): r is PromiseFulfilledResult<{provider: string; result: MetadataResult}> => 
          r.status === 'fulfilled'
      );

      if (successfulResult) {
        return successfulResult.value.result;
      }

      const errors = results
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .reduce((acc, r) => ({
          ...acc,
          [r.reason.provider]: r.reason.message
        }), {});

      throw new MetadataServiceError(errors);

    } catch (error) {
      if (error instanceof MetadataServiceError) {
        throw error;
      }
      this.logger.error('Unexpected error in fetchMetadata:', error);
      throw new Error('Failed to fetch metadata');
    }
  }

  getProviders(): ReadonlyArray<MetadataProvider> {
    return [...this.providers];
  }
}

export function createMetadataService(logger: Logger): MetadataService {
  const config: ProviderConfig = {
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
  };

  return new MetadataService(config, logger);
}
export const metadataService = createMetadataService(logger);