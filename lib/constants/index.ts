export const APP_VERSION = '0.1.0'

export const DB_SETTINGS = {
  MAX_HIGHLIGHTS: 1000,
  MAX_AUDIO_SIZE: 5 * 1024 * 1024, // 5MB
  RETENTION_DAYS: 30,
  AUTO_CLEANUP: true,
}

export const STORAGE_KEYS = {
  HIGHLIGHTS: 'highlights',
  SETTINGS: 'settings',
  USER_PREFERENCES: 'userPreferences',
}