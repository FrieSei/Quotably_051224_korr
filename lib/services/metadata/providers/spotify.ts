import SpotifyWebApi from 'spotify-web-api-node';
import { MetadataProvider, MetadataQuery, MetadataResult } from '../types';

export class SpotifyProvider implements MetadataProvider {
  name = 'Spotify';
  priority = 2;

  private spotify: SpotifyWebApi;

  constructor(clientId: string, clientSecret: string) {
    this.spotify = new SpotifyWebApi({
      clientId,
      clientSecret
    });
  }

  async fetchMetadata(query: MetadataQuery): Promise<MetadataResult> {
    try {
      await this.authenticate();
      const response = await this.searchShow(query);

      if (!response) {
        return {
          success: false,
          source: this.name,
          error: 'No results found'
        };
      }

      return {
        success: true,
        source: this.name,
        data: {
          title: response.name,
          episode: response.episode,
          publisher: response.publisher,
          artwork: response.images?.[0]?.url,
          releaseDate: response.release_date,
          duration: response.duration_ms / 1000,
          url: response.external_urls?.spotify
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

  private async authenticate() {
    const data = await this.spotify.clientCredentialsGrant();
    this.spotify.setAccessToken(data.body.access_token);
  }

  private async searchShow(query: MetadataQuery) {
    // Actual implementation would use the spotify-web-api-node package
    return null;
  }
}