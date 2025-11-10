import { requireAuth } from '@/app/api/lib/auth-helper';
import { withErrorHandler, ApiError, ApiResponse } from '@/app/api/lib/api-helpers';
import { conversationService } from '@/app/api/services/conversation.service';

export const POST = withErrorHandler(async (req: Request) => {
    const { userId } = await requireAuth(req);
    const { conversationId, url } = await req.json();

    if (!conversationId || !url) {
        throw new ApiError(422, 'conversationId and url are required');
    }

    const { context } = await conversationService.addSource(conversationId, userId, url);

    return ApiResponse.success({
        message: 'Source added successfully',
        context: context,
        conversationId: conversationId,
    });
});