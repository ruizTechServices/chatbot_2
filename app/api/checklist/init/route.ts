import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Initial checklist items
const initialItems = [
  { name: "auth", isChecked: false },
  { name: "prisma", isChecked: false },
  { name: "sqlite", isChecked: false },
  { name: "multitenancy", isChecked: false },
  { name: "square", isChecked: false },
  { name: "timer", isChecked: false },
  { name: "pinecone", isChecked: false },
];

// Initialize checklist items
export async function GET() {
  try {
    // Create items if they don't exist
    const results = await Promise.all(
      initialItems.map(item => 
        prisma.checklistItem.upsert({
          where: { name: item.name },
          update: {},
          create: item,
        })
      )
    );
    
    return NextResponse.json({ 
      message: "Checklist initialized successfully",
      items: results 
    });
  } catch (error) {
    console.error("Error initializing checklist:", error);
    return NextResponse.json({ error: "Failed to initialize checklist" }, { status: 500 });
  }
}