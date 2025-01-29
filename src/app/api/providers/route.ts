import { NextResponse } from "next/server";
import { availableProviders } from "@/app/api/data/providers";

export async function GET(){
    const providers = availableProviders.map(({ provider, ...rest }) => rest);
    return NextResponse.json(providers);
}