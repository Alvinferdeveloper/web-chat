
import { useCallback } from 'react';
import { Conversation } from '@/app/types/types';
import { Message } from 'ai/react';

type CreateConversationPayload = Omit<Conversation, 'id' | 'created_at' | 'messages'>;
type UpdateMessagesPayload = {
  conversationId: string;
  newMessages: Omit<Message, 'id'>[];
};
type AddSourcePayload = {
  conversationId: string;
  url: string;
};
type RemoveSourcePayload = {
  conversationId: string;
  urlToRemove: string;
};

export function useConversationApi() {
  const API_BASE_URL = '/api/conversations';

  const getConversations = useCallback(async (): Promise<Conversation[]> => {
    const response = await fetch(API_BASE_URL, { cache: "no-store" });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch conversations');
    }
    return response.json();
  }, []);

  const createConversation = useCallback(async (payload: CreateConversationPayload): Promise<Conversation> => {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create conversation');
    }
    return response.json();
  }, []);

  const updateMessages = useCallback(async (payload: UpdateMessagesPayload): Promise<void> => {
    const filteredMessages = payload.newMessages.filter(m => m.role === 'user' || m.role === 'assistant');
    if (filteredMessages.length === 0) {
      return;
    }

    const body = {
      conversationId: payload.conversationId,
      newMessages: filteredMessages.map(m => ({ role: m.role, content: m.content })),
    };

    const response = await fetch(API_BASE_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save conversation');
    }
  }, []);

  const deleteConversation = useCallback(async (conversationId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${conversationId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete conversation');
    }
  }, []);

  const addSource = useCallback(async (payload: AddSourcePayload): Promise<{ context: string }> => {
    const response = await fetch(`${API_BASE_URL}/add-source`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add source');
    }
    return response.json();
  }, []);

  const removeSource = useCallback(async (payload: RemoveSourcePayload): Promise<Conversation> => {
    const response = await fetch(`${API_BASE_URL}/remove-source`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to remove source');
    }
    return response.json();
  }, []);

  return {
    getConversations,
    createConversation,
    updateMessages,
    deleteConversation,
    addSource,
    removeSource,
  };
}
