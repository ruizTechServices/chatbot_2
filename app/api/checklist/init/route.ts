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
  { name: "langchain", isChecked: false },
  { name: "openai", isChecked: false },
  { name: "Google", isChecked: false },
  { name: "contact form", isChecked: false },
  { name: "email", isChecked: false },
  { name: "webhooks", isChecked: false },
  { name: "admin dashboard", isChecked: false },
  { name: "user dashboard", isChecked: false },
  { name: "user profile", isChecked: false },
  { name: "user settings", isChecked: false },
  { name: "user management", isChecked: false },
  { name: "user roles", isChecked: false },
  { name: "user permissions", isChecked: false },
  { name: "user activity", isChecked: false },
  { name: "user notifications", isChecked: false },
  { name: "user preferences", isChecked: false },
  { name: "user groups", isChecked: false },
  { name: "user tags", isChecked: false },
  { name: "user notes", isChecked: false },
  { name: "terms&conditions", isChecked: false },
  { name: "privacy policy", isChecked: false },
  { name: "cookie policy", isChecked: false },
  { name: "GDPR", isChecked: false },
  { name: "CCPA", isChecked: false },
  { name: "security", isChecked: false },
  { name: "performance", isChecked: false },
  { name: "scalability", isChecked: false },
  { name: "accessibility", isChecked: false },
  { name: "analytics", isChecked: false },
  { name: "monitoring", isChecked: false },
  { name: "backup", isChecked: false },
  { name: "support", isChecked: false },
  { name: "documentation", isChecked: false },
  { name: "API", isChecked: false },
  { name: "SDK", isChecked: false },
  { name: "CLI", isChecked: false },
  { name: "UI", isChecked: false },
  { name: "UX", isChecked: false },
  { name: "testing", isChecked: false },
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