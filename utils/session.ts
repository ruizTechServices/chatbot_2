import { prisma } from "@/utils/prisma";

/**
 * Calculate hours left until a user's session expires.
 * Returns a negative number if already expired or `null` if no session.
 */
export async function getHoursLeft(userId: string): Promise<number | null> {
  const session = await prisma.userSession.findUnique({ where: { userId } });
  if (!session) return null;
  const diffMs = session.expiresAt.getTime() - Date.now();
  return diffMs / (1000 * 60 * 60);
}
