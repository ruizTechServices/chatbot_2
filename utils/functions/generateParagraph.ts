export async function generateParagraph(context: string, length: number): Promise<string> {
  try {
    const response = await fetch('/api/openai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: `Please write a paragraph of about ${length} words about: ${context}` }],
        model: 'gpt-4o',
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.choices?.[0]?.message?.content || 'No response';
  } catch (error) {
    console.error('Error generating paragraph:', error);
    return 'Error generating paragraph';
  }
}