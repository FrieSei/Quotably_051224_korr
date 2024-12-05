import { MetadataProvider, MetadataQuery, MetadataResult } from '../types';

export class ListenNotesProvider implements MetadataProvider {
  name = 'ListenNotes';
  priority = 1;

  private apiKey: string;
  private baseUrl = 'https://listen-api.listennotes.com/api/v2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async fetchMetadata(query: MetadataQuery): Promise<MetadataResult> {
    try {
      const searchResult = await this.searchPodcast(query.title || '');
      
      if (!searchResult) {
        return {
          success: false,
          source: this.name,
          error: 'No matching podcast found'
        };
      }

      return {
        success: true,
        source: this.name,
        data: {
          title: searchResult.title,
          episode: searchResult.latest_episode?.title,
          publisher: searchResult.publisher,
          artwork: searchResult.image,
          releaseDate: searchResult.latest_episode?.pub_date_ms?.toString(),
          duration: searchResult.latest_episode?.audio_length_sec,
          url: searchResult.listennotes_url
        }
      };
    } catch (error) {
      return {
        success: false,
        source: this.name,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async searchPodcast(query: string) {
    try {
      const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}&type=podcast`, {
        headers: {
          'X-ListenAPI-Key': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Listen Notes API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.results[0];
    } catch (error) {
      console.error('Listen Notes search failed:', error);
      return null;
    }
  }
}