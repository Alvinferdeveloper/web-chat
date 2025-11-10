import supabase from '@/lib/supabase';
import { Conversation } from '@/app/types/types';
import { Message } from "ai/react"
import { ApiError } from '../lib/api-helpers';
import { scrappWeb } from './scrapper.service';

type CreateMessage = Omit<Message, 'id' | 'conversation_id' | 'created_at'>;

type CreateConversationPayload = {
    userId: string;
    url: string[];
    summary: string;
    context: string;
    title?: string;
};

export const conversationService = {
    async createConversation({ userId, url, summary, context, title }: CreateConversationPayload): Promise<Conversation> {
        const { data: conversationData, error: conversationError } = await supabase
            .from('conversations')
            .insert({
                user_id: userId,
                url,
                summary,
                context,
                title: title || 'New Conversation',
            })
            .select()
            .single();

        if (conversationError) {
            console.error('Error creating conversation:', conversationError);
            throw new ApiError(500, 'Could not create conversation in database.');
        }

        return {
            ...conversationData,
            messages: [],
        };
    },

    async getConversationsByUserId(userId: string): Promise<Conversation[]> {
        const { data, error } = await supabase
            .from('conversations')
            .select(`
                *,
                messages (*)
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching conversations:', error);
            throw new ApiError(500, 'Could not fetch conversations.');
        }

        return data || [];
    },

    async getConversationById(id: string): Promise<Conversation> {
        const { data, error } = await supabase
            .from('conversations')
            .select(`
                *,
                messages (*)
            `)
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching conversation:', error);
            throw new ApiError(500, 'Could not fetch conversation.');
        }

        if (!data) {
            throw new ApiError(404, 'Conversation not found.');
        }

        return data;
    },

    async appendMessagesToConversation(conversationId: string, newMessages: CreateMessage[]): Promise<void> {
        if (newMessages.length === 0) {
            return;
        }

        const messagesToInsert = newMessages.map(message => ({
            ...message,
            conversation_id: conversationId,
        }));

        const { error: insertError } = await supabase
            .from('messages')
            .insert(messagesToInsert);

        if (insertError) {
            console.error('Error appending messages:', insertError);
            throw new ApiError(500, 'Could not append messages to conversation.');
        }
    },

    async deleteConversation(conversationId: string, userId: string): Promise<void> {
        // First, verify ownership
        const { data: conversation, error: findError } = await supabase
            .from('conversations')
            .select('user_id')
            .eq('id', conversationId)
            .single();

        if (findError && findError.code !== 'PGRST116') {
            console.error('Error finding conversation to delete:', findError);
            throw new ApiError(500, 'Error verifying conversation ownership.');
        }

        if (!conversation) {
            throw new ApiError(404, 'Conversation not found.');
        }

        if (conversation.user_id !== userId) {
            throw new ApiError(403, 'You do not have permission to delete this conversation.');
        }

        // If ownership is verified, proceed with deletion
        const { error: deleteError } = await supabase
            .from('conversations')
            .delete()
            .eq('id', conversationId);

        if (deleteError) {
            console.error('Error deleting conversation:', deleteError);
            throw new ApiError(500, 'Could not delete conversation.');
        }
    },

    async addSource(conversationId: string, userId: string, newUrl: string): Promise<{ context: string }> {
        // 1. Verify ownership
        const { data: conversation, error: findError } = await supabase
            .from('conversations')
            .select('user_id, context, url')
            .eq('id', conversationId)
            .single();

        if (findError && findError.code !== 'PGRST116') {
            throw new ApiError(500, 'Error verifying conversation ownership.');
        }

        if (!conversation) {
            throw new ApiError(404, 'Conversation not found.');
        }

        if (conversation.user_id !== userId) {
            throw new ApiError(403, 'You do not have permission to modify this conversation.');
        }

        const newContent = await scrappWeb([newUrl]);

        const updatedContext = `${conversation.context}\n\n--- NUEVA FUENTE: ${newUrl} ---\n\n${newContent}`;
        const updatedUrl = [...(conversation.url || []), newUrl];

        const { error: updateError } = await supabase
            .from('conversations')
            .update({ context: updatedContext, url: updatedUrl })
            .eq('id', conversationId);

        if (updateError) {
            throw new ApiError(500, 'Could not add new source to conversation.');
        }

        return { context: updatedContext };
    },

    async removeSource(conversationId: string, userId: string, urlToRemove: string): Promise<Conversation> {
        // 1. Verify ownership
        const { data: conversation, error: findError } = await supabase
            .from('conversations')
            .select('user_id, url')
            .eq('id', conversationId)
            .single();

        if (findError && findError.code !== 'PGRST116') {
            throw new ApiError(500, 'Error verifying conversation ownership.');
        }

        if (!conversation) {
            throw new ApiError(404, 'Conversation not found.');
        }

        if (conversation.user_id !== userId) {
            throw new ApiError(403, 'You do not have permission to modify this conversation.');
        }

        // 2. Filter URLs and regenerate context
        const updatedUrls = (conversation.url || []).filter((u: string) => u !== urlToRemove);
        let updatedContext = '';
        if (updatedUrls.length > 0) {
            updatedContext = await scrappWeb(updatedUrls);
        }

        // 3. Update the database
        const { data: updatedConversation, error: updateError } = await supabase
            .from('conversations')
            .update({ context: updatedContext, url: updatedUrls })
            .eq('id', conversationId)
            .select()
            .single();

        if (updateError) {
            throw new ApiError(500, 'Could not remove source from conversation.');
        }

        return updatedConversation;
    },
};
