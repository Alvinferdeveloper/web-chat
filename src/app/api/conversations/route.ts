import { NextResponse } from 'next/server';
import { conversationService } from '../services/conversation.service';
import { requireAuth } from '../lib/auth-helper';
import { withErrorHandler, ApiError, ApiResponse } from '../lib/api-helpers';

export const POST = withErrorHandler(async (req: Request) => {
    const { userId } = await requireAuth(req);

    const body = await req.json();
    const { url, summary, context, title } = body;

    if (!url || !summary || !context) {
        throw new ApiError(400, 'Missing required fields: url, summary, context');
    }

    const newConversation = await conversationService.createConversation({
        userId,
        url,
        summary,
        context,
        title,
    });

    return ApiResponse.success(newConversation, 201);
});

export const PUT = withErrorHandler(async (req: Request) => {
    const { userId } = await requireAuth(req);

    const body = await req.json();
    const { conversationId, newMessages } = body;

    if (!conversationId || !newMessages || !Array.isArray(newMessages) || newMessages.length === 0) {
        throw new ApiError(400, 'Missing required fields for message append: conversationId and newMessages');
    }

    const existingConversation = await conversationService.getConversationById(conversationId);
    if (existingConversation.user_id !== userId) {
        throw new ApiError(403, 'Unauthorized');
    }

    await conversationService.appendMessagesToConversation(conversationId, newMessages);

    return ApiResponse.message('Messages appended successfully');
});

export const GET = withErrorHandler(async (req: Request) => {
    const { userId } = await requireAuth(req);

    const conversations = await conversationService.getConversationsByUserId(userId);
    return ApiResponse.success(conversations);
});
