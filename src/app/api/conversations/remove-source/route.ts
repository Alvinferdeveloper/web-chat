
import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/lib/auth-helper';
import { scrappWeb } from '@/app/api/services/scrapper.service';
import supabase from '@/lib/supabase';

export async function POST(req: Request) {
    const auth = await requireAuth(req);
    if ('error' in auth) return auth.error;

    const { conversationId, urlToRemove } = await req.json();

    if (!conversationId || !urlToRemove) {
        return NextResponse.json(
            { error: 'conversationId and urlToRemove are required' },
            { status: 422 }
        );
    }

    try {
        const { data: conversation, error: findError } = await supabase
            .from('conversations')
            .select('user_id, url')
            .eq('id', conversationId)
            .single();

        if (findError) throw findError;
        if (!conversation) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }
        if (conversation.user_id !== auth.userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const updatedUrls = (conversation.url || []).filter((u: string) => u !== urlToRemove);

        let updatedContext = '';
        if (updatedUrls.length > 0) {
            updatedContext = await scrappWeb(updatedUrls);
        }

        const { data: updatedConversation, error: updateError } = await supabase
            .from('conversations')
            .update({ context: updatedContext, url: updatedUrls })
            .eq('id', conversationId)
            .select()
            .single();

        if (updateError) throw updateError;

        return NextResponse.json(updatedConversation);

    } catch (err) {
        const error = err as Error;
        console.error('Error removing source:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
