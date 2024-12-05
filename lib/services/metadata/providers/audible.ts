import { MetadataProvider, MetadataQuery, MetadataResult } from '@/lib/types';
import { retry } from '@/lib/utils/retry';
import { handleProviderError } from '@/lib/utils/error-handler';
import { PROVIDER_CONFIGS } from '@/lib/constants/errors';

interface AudibleProduct {
  asin: string;
  title: string;
  authors?: { name: string }[];
  narrators?: { name: string }[];
  publisher?: string;
  product_images?: Record<string, string>;
  runtime_length_min?: number;
  release_date?: string;
  language?: string;
  series?: { title: string };
  merchandising_summary?: string;
}

export class AudibleProvider implements MetadataProvider {
  name = 'Audible';
  priority = 2;
  supportedTypes = ['audiobook'] as const;

  private baseUrl = 'https://api.audible.com/1.0/catalog';
  private apiKey: string;
  private config = PROVIDER_CONFIGS.audible;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async fetchMetadata(query: MetadataQuery): Promise<MetadataResult> {
    try {
      const product = await retry(
        () => this.searchAudiobook(query),
        {
          maxAttempts: this.config.maxRetries,
          shouldRetry: (error) => {
            const status = error.status || error.statusCode;
            return status === 429 || (status >= 500 && status < 600);
          }
        }
      );
      
      if (!product) {
        return {
          success: false,
          source: this.name,
          error: 'Audiobook not found'
        };
      }

      return {
        success: true,
        source: this.name,
        data: {
          type: 'audiobook',
          title: product.title,
          author: product.authors?.[0]?.name,
          narrator: product.narrators?.[0]?.name,
          publisher: product.publisher,
          artwork: this.getBestImage(product.product_images),
          duration: product.runtime_length_min ? product.runtime_length_min * 60 : undefined,
          series: product.series?.title,
          language: product.language,
          description: product.merchandising_summary,
          releaseDate: product.release_date
        }
      };
    } catch (error) {
      const metadataError = handleProviderError(error, this.name);
      throw metadataError;
    }
  }

  private async searchAudiobook(query: MetadataQuery): Promise<AudibleProduct | null> {
    const params = new URLSearchParams({
      num_results: '1',
      products_sort_by: '-ReleaseDate',
      response_groups: 'product_attrs,product_extended_attrs,product_desc,media',
      title: query.title || ''
    });

    const response = await fetch(`${this.baseUrl}/products?${params}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Audible API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.products?.[0] || null;
  }

  private getBestImage(images?: Record<string, string>): string | undefined {
    if (!images) return undefined;
    
    // Prefer high-resolution images in order
    const preferredSizes = ['1024', '500', '300', '240'];
    for (const size of preferredSizes) {
      if (images[size]) return images[size];
    }
    
    // Fallback to any available image
    return Object.values(images)[0];
  }
}