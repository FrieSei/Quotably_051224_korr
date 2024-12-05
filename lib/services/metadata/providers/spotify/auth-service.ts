import { cache } from '@/lib/utils/cache';

interface SpotifyAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export class SpotifyAuthService {
  private clientId: string;
  private clientSecret: string;
  private tokenKey = 'spotify_access_token';
  private expiryKey = 'spotify_token_expiry';

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  async getAccessToken(): Promise<string> {
    const cachedToken = cache.get<string>(this.tokenKey);
    const tokenExpiry = cache.get<number>(this.expiryKey);

    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
      return cachedToken;
    }

    return this.refreshAccessToken();
  }

  private async refreshAccessToken(): Promise<string> {
    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      });

      if (!response.ok) {
        throw new Error(`Spotify auth failed: ${response.statusText}`);
      }

      const data: SpotifyAuthResponse = await response.json();
      
      // Cache the token with a 5-minute safety margin
      const expiryTime = Date.now() + (data.expires_in - 300) * 1000;
      cache.set(this.tokenKey, data.access_token);
      cache.set(this.expiryKey, expiryTime);

      return data.access_token;
    } catch (error) {
      console.error('Failed to refresh Spotify token:', error);
      throw error;
    }
  }
}