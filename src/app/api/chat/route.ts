import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';
import { askModelUsingProviderCredentials } from '@/app/api/services/textProvider';
import { availableProviders } from '@/app/api/data/providers';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
   const { provider, apiKey, messages, context } = await req.json();
   console.log(messages, "messages");
       if (!provider || !apiKey) {
           return NextResponse.json({ error: "Missing provider or apiKey" }, { status: 422 });
       }
       const providerData = availableProviders.find((p) => p.id === provider);
       if (!providerData) {
           return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
       }
       try {
           const answer = await askModelUsingProviderCredentials({ modelName: providerData.model, createProvider: providerData.createProvider }, apiKey, messages, context);

           return answer.toDataStreamResponse();
       } catch (err) {
           const error = err as Error;
           return NextResponse.json({ error: error.message }, { status: 400 });
       }
}