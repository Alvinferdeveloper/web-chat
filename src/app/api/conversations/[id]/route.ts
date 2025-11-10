import { requireAuth } from '@/app/api/lib/auth-helper';
import { withErrorHandler, ApiError, ApiResponse } from '@/app/api/lib/api-helpers';
import { conversationService } from '@/app/api/services/conversation.service';

export const DELETE = withErrorHandler(async (req: Request, { params }: { params: { id: string } }) => {
    const { userId } = await requireAuth(req);
    const conversationId = params.id;

    if (!conversationId) {
        throw new ApiError(400, 'Conversation ID is required');
    }

    await conversationService.deleteConversation(conversationId, userId);

    return ApiResponse.message('Conversation deleted successfully');
});
