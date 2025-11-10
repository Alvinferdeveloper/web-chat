import supabase from '@/lib/supabase';
import { Conversation } from '@/app/types/types';
import { Message } from "ai/react"
import { ApiError } from '../lib/api-helpers';

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
};
