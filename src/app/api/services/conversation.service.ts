import supabase from '@/lib/supabase';
import { Conversation, Message } from '@/app/types/types';

type CreateMessage = Omit<Message, 'id' | 'conversation_id' | 'created_at'>;

type CreateConversationPayload = {
    userId: string;
    url: string;
    summary: string;
    context: string;
    title?: string;
    messages: CreateMessage[];
};

export const conversationService = {
    async createConversation({ userId, url, summary, context, title, messages }: CreateConversationPayload): Promise<Conversation> {
        // 1. Create the conversation
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

        const conversationId = conversationData.id;

        // 2. Add conversation_id to each message
        const messagesToInsert = messages.map(message => ({
            ...message,
            conversation_id: conversationId,
        }));

        // 3. Insert all messages
        const { data: messagesData, error: messagesError } = await supabase
            .from('messages')
            .insert(messagesToInsert)
            .select();

        if (messagesError) {
            console.error('Error saving messages:', messagesError);
            // Optional: Delete the conversation if messages fail to save
            await supabase.from('conversations').delete().eq('id', conversationId);
            throw new Error('Could not save messages.');
        }

        return {
            ...conversationData,
            messages: messagesData,
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

        return data || [];
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
            // It might not be an "error" if the conversation just doesn't exist
            if (error.code === 'PGRST116') { // "PostgREST error: Row not found"
                return null;
            }
            throw new Error('Could not fetch conversation.');
        }

        return data;
    }
};
