import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getHoursLeft } from "@/utils/session";

export async function GET(_req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const hoursLeft = await getHoursLeft(userId);
  if (hoursLeft === null) {
    return NextResponse.json({ valid: false, hoursLeft: null }, { status: 200 });
  }

  return NextResponse.json({ valid: hoursLeft > 0, hoursLeft }, { status: 200 });
}
