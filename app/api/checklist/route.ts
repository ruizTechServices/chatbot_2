import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all checklist items
export async function GET() {
  try {
    const items = await prisma.checklistItem.findMany();
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching checklist items:", error);
    return NextResponse.json({ error: "Failed to fetch checklist items" }, { status: 500 });
  }
}

// Create or update a checklist item
export async function POST(request: NextRequest) {
  try {
    const { name, isChecked } = await request.json();
    
    // Validate input
    if (typeof name !== "string" || typeof isChecked !== "boolean") {
      return NextResponse.json(
        { error: "Invalid input. Name must be string and isChecked must be boolean." },
        { status: 400 }
      );
    }

    // Upsert (update or create) the checklist item
    const item = await prisma.checklistItem.upsert({
      where: { name },
      update: { isChecked },
      create: { name, isChecked },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error updating checklist item:", error);
    return NextResponse.json({ error: "Failed to update checklist item" }, { status: 500 });
  }
}