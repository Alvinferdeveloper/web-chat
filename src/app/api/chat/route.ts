import { NextResponse } from 'next/server';
import { askModel } from '@/app/api/services/textProvider';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, context } = await req.json();

    try {
        const answer = await askModel(messages, context);
        return answer.toDataStreamResponse();
    } catch (err) {
        const error = err as Error;
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}