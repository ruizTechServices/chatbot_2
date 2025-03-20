//app/api/google/gemini/route.ts
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { contents } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY is not set" }, { status: 500 });
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contents }),
    }
  );

  if (!response.ok) {
    console.error("Error response from Gemini API:", response.status, response.statusText);
    const errorText = await response.text();
    console.error("Error response body:", errorText);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }

  const data = await response.json();
  return NextResponse.json(data);
};
