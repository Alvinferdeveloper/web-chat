import { NextResponse } from "next/server";
import { getWebSummary } from "@/app/api/services/textProvider";

export async function POST(req: Request) {
    const { url } = await req.json();
    if (!url) {
        return NextResponse.json({ error: "Missing url" }, { status: 422 });
    }
    try {
        const answer = await getWebSummary(url);
        return NextResponse.json({ answer });
    } catch (err) {
        const error = err as Error;
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

}