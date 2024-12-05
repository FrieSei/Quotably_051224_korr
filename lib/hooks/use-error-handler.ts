"use client"

import { useToast } from '@/components/ui/use-toast';
import { ERROR_MESSAGES } from '@/lib/constants/errors';
import { MetadataError } from '@/lib/utils/error-handler';

export function useErrorHandler() {
  const { toast } = useToast();

  const handleError = (error: unknown) => {
    if (error instanceof MetadataError) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });

      // Log error for monitoring
      console.error(`[${error.type}] ${error.provider}: ${error.message}`, {
        error: error.originalError,
        provider: error.provider,
        type: error.type,
        timestamp: new Date().toISOString(),
      });
    } else {
      toast({
        title: 'Error',
        description: ERROR_MESSAGES.UNKNOWN_ERROR,
        variant: 'destructive',
      });

      console.error('Unexpected error:', error);
    }
  };

  return { handleError };
}