
import { useCallback } from 'react';

type WebContextPayload = {
  urls: string[];
};

type WebContextResponse = {
  context: string;
  summary: string;
};

export function useWebContextApi() {
  const getWebContext = useCallback(async (payload: WebContextPayload): Promise<WebContextResponse> => {
    const response = await fetch('/api/get-web-context', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch web context');
    }

    return response.json();
  }, []);

  return { getWebContext };
}
