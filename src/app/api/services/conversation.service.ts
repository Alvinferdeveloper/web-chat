import supabase from '@/lib/supabase';
import { Conversation } from '@/app/types/types';
import { Message } from "ai/react"

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
            throw new Error('Could not create conversation.');
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
            throw new Error('Could not fetch conversations.');
        }

        if (!data) {
            return [];
        }

        // Normalize the url field to always be an array
        const normalizedData = data.map(conv => {
            let urls: string[] = [];
            if (Array.isArray(conv.url)) {
                urls = conv.url;
            } else if (typeof conv.url === 'string') {
                try {
                    // Handle cases where the array is stored as a JSON string
                    const parsed = JSON.parse(conv.url);
                    if (Array.isArray(parsed)) {
                        urls = parsed;
                    } else {
                        // It's a string but not a JSON array, treat as single URL
                        urls = [conv.url];
                    }
                } catch (e) {
                    // Not a JSON string, treat as a single URL from a legacy format
                    urls = [conv.url];
                }
            }
            return { ...conv, url: urls };
        });

        return normalizedData;
    },

    async getConversationById(id: string): Promise<Conversation | null> {
        const { data, error } = await supabase
            .from('conversations')
            .select(`
                *,
                messages (*)
            `)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching conversation:', error);
            if (error.code === 'PGRST116') {
                return null;
            }
            throw new Error('Could not fetch conversation.');
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
            throw new Error('Could not append messages to conversation.');
        }
    },
};
