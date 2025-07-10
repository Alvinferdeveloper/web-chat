
import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/lib/auth-helper';
import supabase from '@/lib/supabase';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const auth = await requireAuth(req);
    if ('error' in auth) return auth.error;
    const userId = auth.userId;
    const conversationId = params.id;

    if (!conversationId) {
        return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 });
    }

    try {
        // Verify ownership before deleting
        const { data: conversation, error: findError } = await supabase
            .from('conversations')
            .select('user_id')
            .eq('id', conversationId)
            .single();

        if (findError) throw findError;

        if (!conversation) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        if (conversation.user_id !== userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { error: deleteError } = await supabase
            .from('conversations')
            .delete()
            .eq('id', conversationId);

        if (deleteError) throw deleteError;

        return NextResponse.json({ message: 'Conversation deleted successfully' }, { status: 200 });

    } catch (err) {
        const error = err as Error;
        console.error('Error deleting conversation:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
