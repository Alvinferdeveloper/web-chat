import { NextResponse } from 'next/server';
import { askModel } from '@/app/api/services/textProvider.service';
import { UsageService } from '../services/usage.service';
import { requireAuth } from '../lib/auth-helper';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const auth = await requireAuth(req);
    if ('error' in auth) return auth.error;
    
    const { messages, context, subscriptionId, planId } = await req.json();
    
    try {
        const isLimitReached = await UsageService.isFreePlanLimitReached(subscriptionId, planId);
        if (isLimitReached) {
            return NextResponse.json({ error: "Free plan limit reached" }, { status: 400 });
        }
        const answer = await askModel(messages, context);
        answer.usage.then(async (usage) => {
            await UsageService.updateUsage(subscriptionId, usage.totalTokens);
        });
        return answer.toDataStreamResponse();
    } catch (err) {
        const error = err as Error;
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}