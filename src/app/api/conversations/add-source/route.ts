import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/lib/auth-helper';
import { scrappWeb } from '@/app/api/services/scrapper.service';
import supabase from '@/lib/supabase';

export async function POST(req: Request) {
    const auth = await requireAuth(req);
    if ('error' in auth) return auth.error;

    const { conversationId, url } = await req.json();

    if (!conversationId || !url) {
        return NextResponse.json(
            { error: 'conversationId and url are required' },
            { status: 422 }
        );
    }

    try {
        const { data: conversation, error: findError } = await supabase
            .from('conversations')
            .select('context, user_id')
            .eq('id', conversationId)
            .single();

        if (findError) throw findError;

        if (!conversation) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        if (conversation.user_id !== auth.userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        const newContent = await scrappWeb([url]);

        const updatedContext = `${conversation.context}\n\n--- NUEVA FUENTE: ${url} ---\n\n${newContent}`;

        const { error: updateError } = await supabase
            .from('conversations')
            .update({ context: updatedContext })
            .eq('id', conversationId);

        if (updateError) throw updateError;

        return NextResponse.json({
            message: 'Source added successfully',
            conversationId: conversationId,
        });

    } catch (err) {
        const error = err as Error;
        console.error('Error adding source:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}