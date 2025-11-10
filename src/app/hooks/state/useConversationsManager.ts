
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Conversation } from '@/app/types/types';
import { Message } from 'ai/react';
import { useConversationApi } from '../api/useConversationApi';

export function useConversationsManager() {
  const { data: session } = useSession();
  const {
    getConversations,
    createConversation: createConversationApi,
    deleteConversation: deleteConversationApi,
    addSource: addSourceApi,
    updateMessages: updateMessagesApi,
    removeSource: removeSourceApi
  } = useConversationApi();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const data = await getConversations();
        setConversations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [getConversations]);

  const createConversation = useCallback(async (context: string, urls: string[], summary: string) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to create a conversation.");
      return;
    }
    const toastId = toast.loading('Saving new conversation...');
    try {
      const newConversationData = {
        user_id: session.user.id,
        url: urls,
        summary: summary,
        context: context,
        title: summary.substring(0, 50) || 'New Web Chat',
      };
      const savedConversation = await createConversationApi(newConversationData);
      setConversations(prev => [savedConversation, ...prev]);
      setActiveConversationId(savedConversation.id);
      toast.success('Conversation saved!', { id: toastId });
      return savedConversation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error(errorMessage, { id: toastId });
    }
  }, [session, createConversationApi]);

  const deleteConversation = useCallback(async (conversationId: string) => {
    const toastId = toast.loading('Deleting conversation...');
    try {
      await deleteConversationApi(conversationId);
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
      }
      toast.success('Conversation deleted!', { id: toastId });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error(errorMessage, { id: toastId });
    }
  }, [activeConversationId, deleteConversationApi]);

  const addSource = useCallback(async (conversationId: string, url: string) => {
    const toastId = toast.loading('Adding new source...');
    try {
      const { context: newContext } = await addSourceApi({ conversationId, url });
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? { ...conv, context: newContext, url: [...conv.url, url] }
            : conv
        )
      );
      toast.success('Source added successfully!', { id: toastId });
      return newContext;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error(errorMessage, { id: toastId });
    }
  }, [addSourceApi]);

  const syncHistoryMessages = useCallback((conversationId: string, messages: Message[]) => {
    setConversations(prevData =>
      prevData.map(conversation =>
        conversation.id === conversationId
          ? {
            ...conversation,
            messages: [...(conversation.messages || []), ...messages]
          }
          : conversation
      )
    );
  }, []);

  const updateMessages = useCallback(async (conversationId: string, newMessages: Message[]) => {
    try {
      await updateMessagesApi({ conversationId, newMessages });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error(`Failed to save messages: ${errorMessage}`);
    }
  }, [updateMessagesApi]);

  const removeSource = useCallback(async (conversationId: string, urlToRemove: string) => {
    const toastId = toast.loading('Removing source...');
    try {
      const updatedConversation = await removeSourceApi({ conversationId, urlToRemove });
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId ? updatedConversation : conv
        )
      );
      toast.success('Source removed successfully!', { id: toastId });
      return updatedConversation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error(errorMessage, { id: toastId });
    }
  }, [removeSourceApi]);

  return {
    conversations,
    activeConversationId,
    setActiveConversationId,
    isLoading,
    error,
    createConversation,
    deleteConversation,
    addSource,
    syncHistoryMessages,
    updateMessages,
    removeSource
  };
}
