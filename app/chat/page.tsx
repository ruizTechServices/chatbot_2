"use client";

import React, { useState } from "react";

export default function ChatPage() {
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleFetch() {
    setLoading(true);
    try {
      const res = await fetch("/api/openai/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Hello who are you??!" }],
          model: "gpt-4o"
        })
      });
      const data = await res.json();
      console.log("Chat response:", data);
      setResponseData(data);
    } catch (error) {
      console.error("Error fetching conversation:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={handleFetch} disabled={loading}>
        {loading ? "Loading..." : "Fetch Conversation"}
      </button>
      {responseData && (
        <pre>{JSON.stringify(responseData, null, 2)}</pre>
      )}
    </div>
  );
}