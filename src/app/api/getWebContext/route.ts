import { NextResponse } from "next/server";
import { getWebSummary } from "@/app/api/services/textProvider.service";
import { scrappWeb } from "../services/scrapper.service";
import { requireAuth } from '../lib/auth-helper';

export async function POST(req: Request) {
    const auth = await requireAuth(req);
    if ('error' in auth) return auth.error;

    const { urls } = await req.json();
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
        return NextResponse.json({ error: "Missing or invalid 'urls' array" }, { status: 422 });
    }
    try {
        // 1. Scrape all URLs to get a combined context.
        const context = await scrappWeb(urls);
        
        let summary = '';
        // If only one URL is provided, generate a summary for it
        if (urls.length === 1) {
            try {
                summary = await getWebSummary(context);
            } catch (summaryError) {
                console.warn('Could not generate summary for single URL:', summaryError);
                // Continue without summary if generation fails
            }
        }

        // 2. Return the combined context and optionally the summary.
        return NextResponse.json({ context, summary });

    } catch (err) {
        const error = err as Error;
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

}