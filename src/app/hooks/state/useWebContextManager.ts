
import { useState, useCallback } from 'react';
import { useWebContextApi } from '../api/useWebContextApi';
import { Conversation } from '@/app/types/types';

export function useWebContextManager() {
  const { getWebContext: getWebContextApi } = useWebContextApi();

  const [urls, setUrls] = useState<string[]>([]);
  const [summary, setSummary] = useState('');
  const [context, setContext] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processNewWebContext = useCallback(async (newUrl: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      const { context: newContext, summary: newSummary } = await getWebContextApi({ urls: [newUrl] });
      setUrls([newUrl]);
      setContext(newContext);
      setSummary(newSummary);
      return { newContext, newSummary, newUrls: [newUrl] };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [getWebContextApi]);

  const addUrlToContext = useCallback((url: string) => {
    if (!urls.includes(url)) {
      setUrls(prev => [...prev, url]);
    }
  }, [urls]);

  const removeUrlFromContext = useCallback(async (urlToRemove: string) => {
    const newUrls = urls.filter(url => url !== urlToRemove);
    setUrls(newUrls);

    if (newUrls.length === 0) {
      setContext('');
      setSummary('');
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      const { context: newContext } = await getWebContextApi({ urls: newUrls });
      setContext(newContext);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setUrls(urls);
    } finally {
      setIsProcessing(false);
    }
  }, [urls, getWebContextApi]);

  const loadContextFromConversation = useCallback((conversation: Conversation | null) => {
    if (conversation) {
      setUrls(conversation.url || []);
      setSummary(conversation.summary || '');
      setContext(conversation.context || '');
    } else {
      setUrls([]);
      setSummary('');
      setContext('');
    }
    setError(null);
    setIsProcessing(false);
  }, []);
  
  const updateContext = useCallback((newContext: string) => {
    setContext(newContext);
  }, []);

  return {
    urls,
    summary,
    context,
    isProcessing,
    error,
    processNewWebContext,
    addUrlToContext,
    removeUrlFromContext,
    loadContextFromConversation,
    updateContext
  };
}
