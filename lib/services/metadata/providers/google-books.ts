import { MetadataProvider, MetadataQuery, MetadataResult } from '../types';

export class GoogleBooksProvider implements MetadataProvider {
  name = 'GoogleBooks';
  priority = 2;
  private baseUrl = 'https://www.googleapis.com/books/v1';

  async fetchMetadata(query: MetadataQuery): Promise<MetadataResult> {
    try {
      const searchResult = await this.searchAudiobook(query.title || '');
      
      if (!searchResult) {
        return {
          success: false,
          source: this.name,
          error: 'No matching audiobook found'
        };
      }

      return {
        success: true,
        source: this.name,
        data: {
          title: searchResult.volumeInfo.title,
          publisher: searchResult.volumeInfo.publisher,
          artwork: searchResult.volumeInfo.imageLinks?.thumbnail,
          releaseDate: searchResult.volumeInfo.publishedDate,
          url: searchResult.volumeInfo.infoLink,
          author: searchResult.volumeInfo.authors?.[0]
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

  private async searchAudiobook(query: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/volumes?q=${encodeURIComponent(query)}+audiobook`
      );

      if (!response.ok) {
        throw new Error(`Google Books API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.items?.[0];
    } catch (error) {
      console.error('Google Books search failed:', error);
      return null;
    }
  }
}