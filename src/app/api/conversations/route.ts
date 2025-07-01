import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { conversationService } from '../services/conversation.service';
import { requireAuth } from '../lib/auth-helper';

export async function POST(req: Request) {
    const auth = await requireAuth(req);
    if ('error' in auth) return auth.error;
    const userId = auth.userId;

    try {
        const body = await req.json();
        const { url, summary, context, title, messages } = body;

        if (!url || !summary || !context || !messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newConversation = await conversationService.createConversation({
            userId,
            url,
            summary,
            context,
            title,
            messages,
        });

        return NextResponse.json(newConversation, { status: 201 });

    } catch (error) {
        console.error('Error creating conversation:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        return NextResponse.json({ error: 'Failed to create conversation', details: errorMessage }, { status: 500 });
    }
}

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const conversations = await conversationService.getConversationsByUserId(session.user.id);
        return NextResponse.json(conversations);

    } catch (error) {
        console.error('Error fetching conversations:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        return NextResponse.json({ error: 'Failed to fetch conversations', details: errorMessage }, { status: 500 });
    }
}
