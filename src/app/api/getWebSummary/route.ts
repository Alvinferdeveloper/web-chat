import { NextResponse } from "next/server";
import { availableProviders } from "@/app/api/data/providers";
import { getWebSummary } from "@/app/api/services/textProvider";

export async function POST(req: Request) {
    const { provider, apiKey, url } = await req.json();
    if (!provider || !apiKey || !url) {
        return NextResponse.json({ error: "Missing provider api key or url" }, { status: 422 });
    }
    const providerData = availableProviders.find((p) => p.id === provider);
    if (!providerData) {
        return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
    }
    try {
        const answer = await getWebSummary({ modelName: providerData.model, createProvider: providerData.createProvider }, apiKey, url);
        return NextResponse.json({ answer });
    } catch (err) {
        const error = err as Error;
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

}