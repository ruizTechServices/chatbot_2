import { prisma } from "@/utils/prisma";

/**
 * Ensure a User row exists for a given Clerk userId.
 * Returns the internal UUID primary key.
 */
export async function ensureUser(clerkId: string, email?: string): Promise<string> {
  const user = await prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: {
      clerkId,
      email: email ?? `no-reply+${clerkId}@example.com`,
    },
  });
  return user.id;
}
