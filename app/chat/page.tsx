// app/chat/page.tsx
"use client";

import React from "react";

export default function ChatPage() {
  // Call your endpoint on mount or via a button click
  React.useEffect(() => {
    // or call this inside a button onClick
    fetch("/api/openai/conversation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // This ensures cookies are sent to the server
      credentials: "include",
      body: JSON.stringify({
        messages: [{ role: "user", content: "Hello who are you??!" }],
        model: "gpt-4o"
      })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Chat response:", data);
      })
      .catch(console.error);
  }, []);

  return <div>Open console to see response!</div>;
}