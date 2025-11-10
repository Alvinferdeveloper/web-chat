import { requireAuth } from '@/app/api/lib/auth-helper';
import { withErrorHandler, ApiError, ApiResponse } from '@/app/api/lib/api-helpers';
import { conversationService } from '@/app/api/services/conversation.service';

export const POST = withErrorHandler(async (req: Request) => {
    const { userId } = await requireAuth(req);
    const { conversationId, urlToRemove } = await req.json();

    if (!conversationId || !urlToRemove) {
        throw new ApiError(422, 'conversationId and urlToRemove are required');
    }

    const updatedConversation = await conversationService.removeSource(conversationId, userId, urlToRemove);

    return ApiResponse.success(updatedConversation);
});
