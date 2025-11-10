import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { ApiError } from "./api-helpers";

export async function requireAuth(req: Request): Promise<{ userId: string }> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new ApiError(401, 'Authentication required');
  }

  return { userId: session.user.id };
}
