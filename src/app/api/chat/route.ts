import { askModel } from '@/app/api/services/textProvider.service';
import { UsageService } from '../services/usage.service';
import { requireAuth } from '../lib/auth-helper';
import { withErrorHandler, ApiError } from '../lib/api-helpers';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export const POST = withErrorHandler(async (req: Request) => {
    await requireAuth(req);

    const { messages, context, subscriptionId, planId } = await req.json();

    const isLimitReached = await UsageService.isFreePlanLimitReached(subscriptionId, planId);
    if (isLimitReached) {
        throw new ApiError(429, "Free plan limit reached. Please upgrade your plan.");
    }

    const answer = await askModel(messages, context);

    answer.usage.then(async (usage) => {
        await UsageService.updateUsage(subscriptionId, usage.totalTokens);
    });

    return answer.toDataStreamResponse();
});