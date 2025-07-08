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
        const { url, summary, context, title } = body;

        if (!url || !summary || !context) {
            return NextResponse.json({ error: 'Missing required fields: url, summary, context' }, { status: 400 });
        }

        const newConversation = await conversationService.createConversation({
            userId,
            url,
            summary,
            context,
            title,
        });

        return NextResponse.json(newConversation, { status: 201 });

    } catch (error) {
        console.error('Error creating conversation:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        return NextResponse.json({ error: 'Failed to create conversation', details: errorMessage }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const auth = await requireAuth(req);
    if ('error' in auth) return auth.error;
    const userId = auth.userId;

    try {
        const body = await req.json();
        const { conversationId, newMessages } = body;

        if (!conversationId || !newMessages || !Array.isArray(newMessages) || newMessages.length === 0) {
            return NextResponse.json({ error: 'Missing required fields for message append: conversationId and newMessages' }, { status: 400 });
        }

        const existingConversation = await conversationService.getConversationById(conversationId);
        if (!existingConversation || existingConversation.user_id !== userId) {
            return NextResponse.json({ error: 'Unauthorized or Conversation not found' }, { status: 403 });
        }
        await conversationService.appendMessagesToConversation(conversationId, newMessages);

        return NextResponse.json({ message: 'Messages appended successfully' }, { status: 200 });

    } catch (error) {
        console.error('Error appending messages to conversation:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        return NextResponse.json({ error: 'Failed to append messages', details: errorMessage }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const auth = await requireAuth(req);
    if ('error' in auth) return auth.error;
    const userId = auth.userId;

    try {
        const conversations = await conversationService.getConversationsByUserId(userId);
        return NextResponse.json(conversations);

    } catch (error) {
        console.error('Error fetching conversations:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        return NextResponse.json({ error: 'Failed to fetch conversations', details: errorMessage }, { status: 500 });
    }
}
