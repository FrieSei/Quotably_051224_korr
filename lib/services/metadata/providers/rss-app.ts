import Parser from 'rss-parser';
import { MetadataProvider, MetadataQuery, MetadataResult } from '@/lib/types';

export class RssAppProvider implements MetadataProvider {
  name = 'RSS.app';
  priority = 1;
  supportedTypes = ['podcast'] as const;

  private parser: Parser;
  private apiKey: string;

  constructor(apiKey: string) {
    this.parser = new Parser();
    this.apiKey = apiKey;
  }

  async fetchMetadata(query: MetadataQuery): Promise<MetadataResult> {
    try {
      const feed = await this.fetchRssFeed(query);
      
      if (!feed) {
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
          type: 'podcast',
          title: feed.title,
          publisher: feed.creator,
          artwork: feed.image?.url,
          description: feed.description,
          url: feed.link,
          language: feed.language
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

  private async fetchRssFeed(query: MetadataQuery) {
    const apiUrl = `https://api.rss.app/v1/feeds?api_key=${this.apiKey}&q=${encodeURIComponent(query.title || '')}`;
    
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (!data.feeds?.length) {
        return null;
      }

      const feedUrl = data.feeds[0].rss_url;
      return await this.parser.parseURL(feedUrl);
    } catch {
      return null;
    }
  }
}