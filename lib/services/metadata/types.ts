export interface MetadataProvider {
  name: string;
  priority: number;
  supportedTypes: ContentType[];
  fetchMetadata(query: MetadataQuery): Promise<MetadataResult>;
}

export type ContentType = 'podcast' | 'audiobook' | 'music';

export interface MetadataQuery {
  type?: ContentType;
  title?: string;
  author?: string;
  isbn?: string;
  // Add other search parameters
}

export interface MetadataResult {
  success: boolean;
  source: string;
  data?: ContentMetadata;
  error?: string;
}

export interface ContentMetadata {
  id: string;
  title: string;
  author: string;
  description?: string;
  duration?: number;
  // Add other metadata fields
}