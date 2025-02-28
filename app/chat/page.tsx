export default async function ChatPage() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/openai/conversation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          { role: "user", content: "Hello from my frontend!" }
        ],
        model: "gpt-4o"
      }),
      cache: 'no-store'
    });
  
    const data = await response.json();
  
    return (
      <div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  }