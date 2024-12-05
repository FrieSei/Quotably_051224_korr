import { MetadataQuery, MetadataResult } from '@/lib/types';
import { SpotifyAuthService } from './auth-service';
import { BaseMetadataProvider } from '../base-provider';

export class SpotifyProvider extends BaseMetadataProvider {
  name = 'Spotify';
  priority = 2;
  supportedTypes = ['podcast', 'audiobook'] as const;

  private authService: SpotifyAuthService;
  private baseUrl = 'https://api.spotify.com/v1';

  constructor(clientId: string, clientSecret: string) {
    super();
    this.authService = new SpotifyAuthService(clientId, clientSecret);
  }

  protected async fetchFromSource(query: MetadataQuery): Promise<MetadataResult> {
    const token = await this.authService.getAccessToken();
    const searchResult = await this.searchContent(query, token);

    if (!searchResult) {
      return {
        success: false,
        source: this.name,
        error: 'No matching content found'
      };
    }

    return {
      success: true,
      source: this.name,
      data: {
        type: searchResult.type as 'podcast' | 'audiobook',
        title: searchResult.name,
        publisher: searchResult.publisher,
        artwork: searchResult.images?.[0]?.url,
        releaseDate: searchResult.release_date,
        duration: searchResult.duration_ms ? searchResult.duration_ms / 1000 : undefined,
        url: searchResult.external_urls?.spotify,
        description: searchResult.description,
        author: searchResult.authors?.[0],
        narrator: searchResult.narrators?.[0],
        language: searchResult.language
      }
    };
  }

  private async searchContent(query: MetadataQuery, token: string) {
    const types = query.type ? [query.type] : ['show', 'audiobook'];
    const q = encodeURIComponent(query.title || '');
    
    const response = await fetch(
      `${this.baseUrl}/search?q=${q}&type=${types.join(',')}&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.shows?.items[0] || data.audiobooks?.items[0];
  }
}