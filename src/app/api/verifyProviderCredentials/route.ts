import { NextResponse } from "next/server";
import { availableProviders } from "@/app/api/data/providers";
import { askModelUsingProviderCredentials } from "@/app/api/services/textProvider";
export async function POST(req: Request){
    const { provider, apiKey } = await req.json();
    if (!provider || !apiKey) {
        return NextResponse.json({ error: "Missing provider or apiKey" }, { status: 400 });
    }
    const providerData = availableProviders.find((p) => p.id === provider);
   console.log(availableProviders, provider)
    if (!providerData) {
        return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
    }
    try {
        const answer = await askModelUsingProviderCredentials({ modelName: providerData.model, createProvider: providerData.createProvider}, apiKey);
        return NextResponse.json({ answer });
    }catch(err){
        const error = err as Error;
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
    
}