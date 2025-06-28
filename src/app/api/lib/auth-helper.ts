import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from 'next/server';

export async function requireAuth(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return {
      error: NextResponse.json(
        { error: 'No autorizado' }, 
        { status: 401 }
      )
    };
  }

  return { userId: session.user.id };
}
