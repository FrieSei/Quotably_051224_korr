"use client"

import { useState, useCallback } from 'react';
import { Highlight, ContentMetadata } from '@/lib/types';
import { storageService } from '@/lib/storage/storage-service';
import { useToast } from '@/components/ui/use-toast';
import { useErrorTracking } from './use-error-tracking';

export function useStorage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { trackError } = useErrorTracking();

  const saveHighlight = useCallback(async (
    content: string,
    metadata?: ContentMetadata
  ): Promise<string | null> => {
    setIsLoading(true);
    try {
      const id = await storageService.saveHighlight(content, metadata);
      toast({
        title: 'Success',
        description: 'Highlight saved successfully',
      });
      return id;
    } catch (error) {
      trackError(error as Error, { operation: 'saveHighlight' });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast, trackError]);

  const getHighlight = useCallback(async (id: string): Promise<Highlight | null> => {
    setIsLoading(true);
    try {
      return await storageService.getHighlight(id) || null;
    } catch (error) {
      trackError(error as Error, { operation: 'getHighlight' });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [trackError]);

  const getRecentHighlights = useCallback(async (limit?: number): Promise<Highlight[]> => {
    setIsLoading(true);
    try {
      return await storageService.getRecentHighlights(limit);
    } catch (error) {
      trackError(error as Error, { operation: 'getRecentHighlights' });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [trackError]);

  const updateHighlight = useCallback(async (
    id: string,
    updates: Partial<Highlight>
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      await storageService.updateHighlight(id, updates);
      toast({
        title: 'Success',
        description: 'Highlight updated successfully',
      });
      return true;
    } catch (error) {
      trackError(error as Error, { operation: 'updateHighlight' });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast, trackError]);

  const deleteHighlight = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await storageService.deleteHighlight(id);
      toast({
        title: 'Success',
        description: 'Highlight deleted successfully',
      });
      return true;
    } catch (error) {
      trackError(error as Error, { operation: 'deleteHighlight' });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast, trackError]);

  return {
    isLoading,
    saveHighlight,
    getHighlight,
    getRecentHighlights,
    updateHighlight,
    deleteHighlight,
  };
}