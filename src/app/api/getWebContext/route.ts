import { NextResponse } from "next/server";
import { getWebSummary } from "@/app/api/services/textProvider.service";
import { scrappWeb } from "../services/scrapper.service";
import { requireAuth } from '../lib/auth-helper';

export async function POST(req: Request) {
    const auth = await requireAuth(req);
    if ('error' in auth) return auth.error;

    const { url } = await req.json();
    if (!url) {
        return NextResponse.json({ error: "Missing url" }, { status: 422 });
    }
    try {
        const context = await scrappWeb(url);
        const summary = await getWebSummary(context);
        return NextResponse.json({ context, summary });
    } catch (err) {
        const error = err as Error;
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

}